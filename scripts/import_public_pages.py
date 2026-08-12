#!/usr/bin/env python3
"""Build a deterministic, editorial-only snapshot from public Sie-sucht-Sie pages."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup, Comment

SITE = "https://www.sie-sucht-sie.de"
SITEMAP = f"{SITE}/sitemap.php"
OUT = Path(__file__).resolve().parents[1] / "data" / "pages.json"
PLATFORM_ROOTS = {"registration", "login", "suche", "hilfe", "kontakt", "gutschein", "datenschutz.html", "impressum.html", "agb.html"}
DYNAMIC_SELECTORS = [
    "form", "script", "style", "noscript", "iframe", ".grid-view", ".result-item",
    ".user-box", ".register-box-module", ".cookie-consent", "aside", "nav",
]

session = requests.Session()
session.headers["User-Agent"] = "Sie-sucht-Sie migration snapshot/1.0"


def fetch(url: str, attempts: int = 4) -> requests.Response:
    last = None
    for attempt in range(attempts):
        last = session.get(url, timeout=35)
        if last.status_code == 200:
            return last
        time.sleep(0.7 * (attempt + 1))
    assert last is not None
    return last


def normalize_path(url: str) -> str:
    path = urlparse(url).path
    return "/" if path == "/" else "/" + path.strip("/")


def page_type(path: str) -> str:
    root = path.lstrip("/").split("/", 1)[0]
    if root in PLATFORM_ROOTS:
        return "platform"
    if root in {"partnersuche", "oesterreich", "schweiz"}:
        return "location"
    if root == "lexikon":
        return "lexicon"
    if root == "magazin":
        return "magazine"
    return "editorial"


def text_or(node, fallback=""):
    return node.get_text(" ", strip=True) if node else fallback


def clean_content(soup: BeautifulSoup, kind: str) -> str:
    if kind == "platform":
        return ""
    main = soup.select_one("main#static") or soup.select_one("main.city-container") or soup.select_one("main")
    if not main:
        return ""
    fragment = BeautifulSoup(str(main), "html.parser")
    for selector in DYNAMIC_SELECTORS:
        for node in fragment.select(selector):
            node.decompose()
    for node in fragment.find_all(string=lambda value: isinstance(value, Comment)):
        node.extract()
    for node in fragment.find_all(True):
        for attribute in list(node.attrs):
            if attribute not in {"href", "src", "alt", "width", "height"}:
                del node.attrs[attribute]
        if node.name == "a":
            href = node.get("href", "")
            if "registration/?user=" in href:
                node.unwrap()
                continue
            if href.startswith(SITE):
                node["href"] = normalize_path(href)
            elif href.lower().startswith("http://sie-sucht-sie.de"):
                node["href"] = "/"
        if node.name == "img" and "cdn3.icony-hosting.de/user-media" in node.get("src", ""):
            node.decompose()
    html = str(fragment)
    html = re.sub(r"\s+", " ", html).strip()
    return html


def fallback_title(path: str) -> str:
    if path == "/":
        return "Sie sucht Sie"
    return path.rstrip("/").split("/")[-1].replace("-", " ").title()


def main():
    sitemap_response = fetch(SITEMAP)
    sitemap_response.raise_for_status()
    urls = re.findall(r"<loc>(.*?)</loc>", sitemap_response.text)
    seen = set()
    pages = []
    for index, source_url in enumerate(urls, 1):
        path = normalize_path(source_url)
        if path in seen:
            continue
        seen.add(path)
        kind = page_type(path)
        response = fetch(source_url)
        soup = BeautifulSoup(response.text, "html.parser") if response.status_code == 200 else BeautifulSoup("", "html.parser")
        title = text_or(soup.title, fallback_title(path))
        description_node = soup.find("meta", attrs={"name": "description"})
        description = (description_node.get("content", "").strip() if description_node else "") or f"Informationen und hilfreiche Einstiege zu {fallback_title(path)} auf Sie-sucht-Sie.de."
        h1 = text_or(soup.find("h1"), fallback_title(path))
        canonical = f"{SITE}{'/' if path == '/' else path}"
        content = clean_content(soup, kind)
        images = []
        for image in BeautifulSoup(content, "html.parser").find_all("img", src=True):
            if image["src"] not in [item["src"] for item in images]:
                images.append({"src": image["src"], "alt": image.get("alt", "")})
        iframe = soup.find("iframe", src=re.compile(r"js\.icony\.com/frame/"))
        pages.append({
            "path": path,
            "sourceUrl": source_url,
            "canonical": canonical,
            "type": kind,
            "title": title,
            "description": description,
            "h1": h1,
            "contentHtml": content,
            "images": images,
            "widgetUrl": iframe.get("src") if iframe else None,
            "sourceStatus": response.status_code,
        })
        print(f"[{index}/{len(urls)}] {response.status_code} {path}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": SITEMAP, "pages": pages}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(pages)} unique pages to {OUT}")


if __name__ == "__main__":
    main()

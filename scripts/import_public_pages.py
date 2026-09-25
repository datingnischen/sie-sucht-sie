#!/usr/bin/env python3
"""Build a deterministic, editorial-only snapshot from public Sie-sucht-Sie pages."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Comment

SITE = "https://www.sie-sucht-sie.de"
SITEMAP = f"{SITE}/sitemap.php"
OUT = Path(__file__).resolve().parents[1] / "data" / "pages.json"
PLATFORM_ROOTS = {"registration", "login", "suche", "hilfe", "kontakt", "gutschein", "datenschutz.html", "impressum.html", "agb.html", "sicherheit-und-datenschutz.html", "redaktionelle-kontrolle.html", "kostenlose-basis-mitgliedschaft.html", "unsere-erfolgsgeschichten.html", "dating-tipps", "magazin"}
ALLOWED_TAGS = {
    "a", "b", "blockquote", "br", "div", "em", "figcaption", "figure", "h1", "h2", "h3", "h4",
    "hr", "img", "li", "main", "ol", "p", "picture", "section", "small", "span", "strong", "ul",
}
ALLOWED_IMAGE_HOSTS = {"static-cms.icony-hosting.de", "static2.icony-hosting.de", "www.sie-sucht-sie.de"}
EXCLUDED_RESOURCE_HOSTS = {"singleboersen-ueberblick.de", "www.singleboersen-ueberblick.de"}
VERIFIED_LOCATION_STATISTIC_IMAGE_URLS = {
    "https://static-cms.icony-hosting.de/cms/7A0B5B7805776970CF833128F57F154E129C3F9F2628B0E151FD14091CF29DF4/600/lesbisch-muenchen-statistik.jpg",
    "https://static-cms.icony-hosting.de/cms/3C1ECA90E96ADED69A434ECEBB159FC7865C309E35859C45D4B211D95970E2FE/600/sie-sucht-sie-berlin-statistiken.jpg",
    "https://static-cms.icony-hosting.de/cms/1C77F826642907FF8CC1C0C57AF48D532202C05892EE2D707B4862543E20201B/1000/Wien.jpg",
    "https://static-cms.icony-hosting.de/cms/5AAF163391E10EEC7DA0826B2F59E51398A18A83CFF73FE47EE2EFBC7695BB45/1000/Graz.jpg",
    "https://static-cms.icony-hosting.de/cms/B14E3C530B7D9C36FE465F710831C28CF990B95CD3E5F7E786EBCCFCDB9FDA92/1000/linz.jpg",
    "https://static-cms.icony-hosting.de/cms/3E2AAA98D4D05C7F70949A2B0671E5815AA217AD52025ACA472EA0E6A7B17FC1/1000/salzburg.jpg",
    "https://static-cms.icony-hosting.de/cms/C4D06C43BB3EBBE6365B5EC084B09103339E914981918F2040735D9AC3F9ADA2/1000/innsbruck.jpg",
    "https://static-cms.icony-hosting.de/cms/801A772145035BA44653F2965931C727D3B5954AD5A53088B7BB9A227999D2B6/1000/klagenfurt.jpg",
    "https://static-cms.icony-hosting.de/cms/32149967A8074C9D8C5C6012FBC0449C0A548142FC14879DD9AD95E009F42D11/1000/villach.jpg",
    "https://static-cms.icony-hosting.de/cms/CF1646DB445D1D4046A560B18D3315DD5A37AAA8F668F4E217C42C84E0F0FD85/1000/wels.jpg",
    "https://static-cms.icony-hosting.de/cms/0A5792BFB79281E56F191556D5B759FCC4FE09BB0B45DF31F42D8DC636F79055/1000/sp.jpg",
    "https://static-cms.icony-hosting.de/cms/83872043FD9C380BC89727CE7CD8ACE99A97642818BEF4E116FB2BE71BD65E60/1000/Dornbirn.jpg",
    "https://static-cms.icony-hosting.de/cms/7C6DC556D652951CA833B872EC6080D0D0F56FCE2C22848B18AD34CB21561376/1000/freiburg.jpg",
    "https://static-cms.icony-hosting.de/cms/9E8D71729979B1C649826D749B73637E95D909D61B36F09BC77630156EF2CB67/1000/heidelberg3.jpg",
    "https://static-cms.icony-hosting.de/cms/C69BFDF2B571AAC70D41C0AF0D0DAEEA75B9CE5A7BFF29EA8E40B804617669B5/1000/essen2.jpg",
    "https://static-cms.icony-hosting.de/cms/4CB15B4268A648CB582315BDCBF59E10EB074DE3D1B7FDBA2114DCEB09DC2860/1000/sie-sucht-sie-de-aachen.jpg",
    "https://static-cms.icony-hosting.de/cms/6EF837482B9F6539DBDC6E546E566438F64C271233193EB94A3210BAB1622986/1000/sie-sucht-sie-de-magdeburg.jpg",
    "https://static-cms.icony-hosting.de/cms/3F62C5954836D7385128021613F36033B3C43922889D6B0B7AF4845FFB796587/1000/sie-sucht-sie-de-karlsruhe.jpg",
}
KNOWN_PATH_FIXES = {
    "/schweiz/winterhur": "/schweiz/winterthur",
    "/videodate.html": "/videodating.html",
    "/startseite": "/",
}
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


def is_internal_market_url(parsed) -> bool:
    return parsed.scheme == "https" and parsed.netloc.lower() in {"sie-sucht-sie.de", "www.sie-sucht-sie.de"}


def statistics_module_end(start):
    node = start.next_sibling
    factor = None
    while node:
        if getattr(node, "name", None) == "h2":
            break
        if getattr(node, "name", None) == "h3" and "Flirt-Faktor" in node.get_text(" ", strip=True):
            factor = node
            break
        node = node.next_sibling
    if not factor:
        return None

    end = factor
    summary_seen = False
    node = factor.next_sibling
    while node:
        following = node.next_sibling
        name = getattr(node, "name", None)
        text = node.get_text(" ", strip=True) if name else str(node).strip()
        has_image = bool(name and node.find("img"))
        if not text and not has_image and (name in {"p", "br"} or name is None):
            end = node
        elif name in {"p", "small"} and not has_image and not summary_seen:
            end = node
            summary_seen = True
        else:
            break
        node = following
    return end


def remove_inclusive_range(start, end) -> None:
    node = start
    while node:
        following = node.next_sibling
        finished = node is end
        node.extract()
        if finished:
            break
        node = following


def verified_preceding_statistics_image(heading):
    preceding = heading.previous_sibling
    while preceding:
        name = getattr(preceding, "name", None)
        text = preceding.get_text(" ", strip=True) if name else str(preceding).strip()
        if text or (name and preceding.find("img")):
            break
        preceding = preceding.previous_sibling
    if not preceding or not getattr(preceding, "name", None) or preceding.get_text(" ", strip=True):
        return None

    direct_elements = preceding.find_all(True, recursive=False)
    all_images = preceding.find_all("img")
    if len(direct_elements) != 1 or direct_elements[0].name != "img" or len(all_images) != 1 or direct_elements[0] is not all_images[0]:
        return None
    if any(not getattr(child, "name", None) and str(child).strip() for child in preceding.contents):
        return None

    source = all_images[0].get("src", "")
    return preceding if source in VERIFIED_LOCATION_STATISTIC_IMAGE_URLS else None


def clean_location_structure(fragment: BeautifulSoup) -> None:
    statistics_heading = re.compile(r"\b(?:flirt\s*&\s*)?dating(?:\s|-).*statistik\b", re.IGNORECASE)
    for heading in list(fragment.find_all("h2")):
        if statistics_heading.search(heading.get_text(" ", strip=True)):
            statistics_section = None
            sibling = heading.next_sibling
            while sibling and getattr(sibling, "name", None) != "h2":
                if getattr(sibling, "name", None) == "section" and any(
                    "Flirt-Faktor" in marker.get_text(" ", strip=True) for marker in sibling.find_all("h3")
                ):
                    statistics_section = sibling
                    break
                sibling = sibling.next_sibling
            end = statistics_module_end(heading) if not statistics_section else None
            if not statistics_section and not end:
                continue

            preceding = verified_preceding_statistics_image(heading)
            if preceding:
                preceding.decompose()
            if statistics_section:
                heading.decompose()
                statistics_section.decompose()
            else:
                remove_inclusive_range(heading, end)

    # Some legacy pages lost the h2 introducing the same statistics module.
    for heading in list(fragment.find_all("h3")):
        if not heading.get_text(" ", strip=True).startswith("👩‍❤️‍👩 Community in"):
            continue
        sibling = heading
        has_flirt_factor = False
        while sibling and getattr(sibling, "name", None) != "h2":
            if getattr(sibling, "name", None) == "h3" and "Flirt-Faktor" in sibling.get_text(" ", strip=True):
                has_flirt_factor = True
                break
            sibling = sibling.next_sibling
        if has_flirt_factor:
            end = statistics_module_end(heading)
            if end:
                remove_inclusive_range(heading, end)

    for heading in list(fragment.find_all(["h2", "h3", "h4"])):
        if heading.find("img") and not heading.get_text(" ", strip=True):
            heading.unwrap()
        elif not heading.get_text(" ", strip=True):
            heading.decompose()
    for paragraph in list(fragment.find_all("p")):
        if not paragraph.get_text(" ", strip=True) and not paragraph.find("img"):
            paragraph.decompose()


def safe_href(raw_href: str, source_url: str) -> str | None:
    raw = raw_href.strip()
    if not raw:
        return None
    if raw.startswith("#"):
        return raw
    if raw.lower().startswith("hhttp"):
        raw = raw[1:]
    absolute = urljoin(source_url, raw)
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"} or parsed.hostname in EXCLUDED_RESOURCE_HOSTS:
        return None
    if is_internal_market_url(parsed):
        path = normalize_path(absolute)
        path = KNOWN_PATH_FIXES.get(path, path)
        root = path.lstrip("/").split("/", 1)[0]
        if root in PLATFORM_ROOTS:
            suffix = parsed.query and f"?{parsed.query}" or ""
            return f"{SITE}{path}{suffix}"
        return path
    return absolute


def clean_location_description(description: str) -> str:
    return re.sub(r"\s+und\s+Flirt-(?:Faktor|Statistik)\b", "", description, flags=re.IGNORECASE)


def is_well_formed_image_reference(value) -> bool:
    if not isinstance(value, str) or not value or value != value.strip():
        return False
    if "\\" in value or any(char.isspace() or ord(char) < 0x20 or ord(char) == 0x7F or 0xD800 <= ord(char) <= 0xDFFF for char in value):
        return False
    return re.search(r"%(?![0-9A-Fa-f]{2})", value) is None


def clean_content(soup: BeautifulSoup, kind: str, source_url: str) -> str:
    if kind == "platform":
        return ""
    main = soup.select_one("main#static") or soup.select_one("main.city-container") or soup.select_one("main")
    if not main:
        return ""
    # Validate original attribute values before serialization can coerce
    # parser-produced lists, tuples, bytes, or numeric values into strings.
    for image in list(main.find_all("img")):
        if not is_well_formed_image_reference(image.get("src", "")):
            image.decompose()
    fragment = BeautifulSoup(str(main), "html.parser")
    for selector in DYNAMIC_SELECTORS:
        for node in fragment.select(selector):
            node.decompose()
    for node in fragment.find_all(string=lambda value: isinstance(value, Comment)):
        node.extract()
    # The Next.js page shell owns the single main landmark and visible h1.
    # Imported fragments must not create nested mains or duplicate page titles.
    for node in fragment.find_all("h1"):
        node.decompose()
    for node in fragment.find_all("main"):
        node.unwrap()
    if kind == "location":
        clean_location_structure(fragment)
    nested_anchors = [node for node in fragment.find_all("a") if node.find_parent("a") or node.find("a")]
    for node in reversed(nested_anchors):
        if node.parent:
            node.unwrap()
    for node in list(fragment.find_all(True)):
        if node.name not in ALLOWED_TAGS:
            node.unwrap()
            continue
        if node.name == "a":
            safe = safe_href(node.get("href", ""), source_url)
            if not safe or "registration/?user=" in safe:
                node.unwrap()
                continue
            node.attrs = {"href": safe}
            parsed_href = urlparse(safe)
            is_internal = is_internal_market_url(parsed_href)
            is_registration = is_internal and parsed_href.path.rstrip("/") == "/registration"
            if is_registration and not node.find("img") and node.get_text(" ", strip=True):
                aid = "location" if kind == "location" else "magazin"
                node.attrs = {
                    "href": f"{SITE}/registration/?AID={aid}",
                    "class": "inline-content-cta",
                }
            elif parsed_href.scheme in {"http", "https"} and not is_internal:
                node.attrs.update({"rel": "nofollow noopener noreferrer", "target": "_blank"})
        elif node.name == "img":
            raw_source = node.get("src", "")
            if not is_well_formed_image_reference(raw_source):
                node.decompose()
                continue
            try:
                source = urljoin(source_url, raw_source)
                parsed = urlparse(source)
                hostname = parsed.hostname
                port = parsed.port
            except (TypeError, ValueError, UnicodeError):
                node.decompose()
                continue
            if (
                parsed.scheme != "https"
                or hostname not in ALLOWED_IMAGE_HOSTS
                or hostname in EXCLUDED_RESOURCE_HOSTS
                or parsed.username is not None
                or parsed.password is not None
                or port is not None
                or parsed.netloc != hostname
            ):
                node.decompose()
                continue
            node.attrs = {key: node.attrs[key] for key in ("src", "alt", "width", "height") if key in node.attrs}
            node["src"] = source
        else:
            node.attrs = {}
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
        if kind == "location":
            description = clean_location_description(description)
        h1 = text_or(soup.find("h1"), fallback_title(path))
        canonical = f"{SITE}{'/' if path == '/' else path}"
        content = clean_content(soup, kind, source_url)
        images = []
        for image in BeautifulSoup(content, "html.parser").find_all("img", src=True):
            if image["src"] not in [item["src"] for item in images]:
                images.append({"src": image["src"], "alt": image.get("alt", "")})
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
            "widgetUrl": None,
            "sourceStatus": response.status_code,
        })
        print(f"[{index}/{len(urls)}] {response.status_code} {path}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": SITEMAP, "pages": pages}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(pages)} unique pages to {OUT}")


if __name__ == "__main__":
    main()

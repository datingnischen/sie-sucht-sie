import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { selectHeroImage } from "../lib/hero-image.mjs";

const catalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));

test("the imported catalog preserves the complete sitemap editorial inventory", () => {
  assert.ok(catalog.pages.length >= 70, `expected at least 70 pages, got ${catalog.pages.length}`);
  for (const path of ["/", "/partnersuche", "/partnersuche/berlin", "/oesterreich/wien", "/schweiz/zuerich", "/lexikon/lesbenseiten"]) {
    assert.ok(catalog.pages.some((page) => page.path === path), `missing ${path}`);
  }
});

test("every imported page has an SEO identity and source provenance", () => {
  for (const page of catalog.pages) {
    assert.ok(page.title);
    assert.ok(page.description);
    assert.match(page.sourceUrl, /^https:\/\/www\.sie-sucht-sie\.de\//);
    assert.equal(page.canonical, `https://www.sie-sucht-sie.de${page.path === "/" ? "/" : page.path}`);
  }
});

test("dynamic member content and platform forms are not persisted", () => {
  const serialized = JSON.stringify(catalog);
  assert.doesNotMatch(serialized, /cdn3\.icony-hosting\.de\/user-media/);
  assert.doesNotMatch(serialized, /js\.icony\.com\/frame/);
  assert.doesNotMatch(serialized, /<iframe/i);
  assert.doesNotMatch(serialized, /<form/i);
  assert.doesNotMatch(serialized, /registration\/\?user=/i);
  assert.ok(catalog.pages.every((page) => page.widgetUrl === null));
});

test("imported HTML allows no active or privacy-leaking URLs", () => {
  const html = catalog.pages.map((page) => page.contentHtml).join("\n");
  assert.doesNotMatch(html, /(?:javascript|data|vbscript):/i);
  assert.doesNotMatch(html, /singleboersen-ueberblick\.de/i);
  assert.doesNotMatch(html, /hhttps?:/i);
  assert.doesNotMatch(html, /(?:href|src)=["']\.\.\//i);
  assert.doesNotMatch(html, /href=["']\/(?:videodate\.html|startseite)["']/i);
});

test("excluded platform links stay absolute for upstream ownership", () => {
  const html = catalog.pages.map((page) => page.contentHtml).join("\n");
  // The magazine is migrated (data/magazine.json); its links are relative on purpose.
  for (const root of ["registration", "login", "hilfe", "kontakt", "datenschutz.html", "impressum.html", "agb.html"]) {
    const relative = new RegExp(`href=["']/${root}(?:[/?"'])`, "i");
    assert.doesNotMatch(html, relative, `relative excluded link found for ${root}`);
  }
});

test("city heroes prefer representative city photography over seals and statistics graphics", () => {
  const stuttgart = catalog.pages.find((page) => page.path === "/partnersuche/stuttgart");
  const hero = selectHeroImage(stuttgart.images);
  assert.equal(hero.src, "https://static-cms.icony-hosting.de/cms/D18BD92B8F841ABE2B527007F1BBE0F3ADB184D609DEE79C8D63AC63715B80EB/sie-sucht-sie-in-stuttgart.jpg");
  assert.equal(hero.alt, "Partnersuche in Stuttgart");
});

test("location image inventories contain only images retained by the sanitized fragment", () => {
  for (const page of catalog.pages.filter((item) => item.type === "location")) {
    const retained = [...page.contentHtml.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((match) => match[1]);
    assert.deepEqual(page.images.map((image) => image.src), [...new Set(retained)], page.path);
  }
});

test("editorial hero images never select recommendation seals", () => {
  for (const page of catalog.pages) {
    const hero = selectHeroImage(page.images);
    assert.doesNotMatch(hero?.src || "", /singleboersen-ueberblick\.de/i, page.path);
  }
});

test("ICONY-served trust pages are platform routes linked on the live domain", async () => {
  const { classifyPath } = await import("../lib/site-contract.mjs");
  const trustPaths = ["/sicherheit-und-datenschutz.html", "/redaktionelle-kontrolle.html", "/kostenlose-basis-mitgliedschaft.html", "/unsere-erfolgsgeschichten.html"];
  for (const path of trustPaths) assert.equal(classifyPath(path), "platform");
  const shell = await readFile(new URL("../components/site-shell.tsx", import.meta.url), "utf8");
  const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const path of trustPaths) assert.ok(!(shell + home).includes(`"${path}"`), `${path} must not be a relative link`);
  const content = await readFile(new URL("../lib/content.ts", import.meta.url), "utf8");
  assert.match(content, /ICONY_PAGE_LINK/);
});

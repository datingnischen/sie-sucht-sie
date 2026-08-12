import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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

test("dynamic member media and platform forms are not persisted", () => {
  const serialized = JSON.stringify(catalog);
  assert.doesNotMatch(serialized, /cdn3\.icony-hosting\.de\/user-media/);
  assert.doesNotMatch(serialized, /<form/i);
  assert.doesNotMatch(serialized, /registration\/\?user=/i);
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { CITY_PHOTOS, cityPhotoCredit, withCityPhoto } from "../lib/city-photos.mjs";
import { selectCityPhoto } from "../lib/city-guide.mjs";

const pages = JSON.parse(readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;

test("own city photos exist, carry alt text and a licensed credit", () => {
  for (const [path, photo] of Object.entries(CITY_PHOTOS)) {
    assert.ok(pages.some((page) => page.path === path), path);
    assert.ok(existsSync(new URL(`../public${photo.file}`, import.meta.url)), photo.file);
    assert.ok(photo.alt.length > 20, `${path} alt`);
    assert.match(photo.credit.url, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.match(photo.credit.label, /, CC BY(-SA)? \d\.\d$/);
    assert.deepEqual(cityPhotoCredit(`${path}/`), photo.credit);
  }
});

test("cities without an import photo get their own hero photo", () => {
  for (const path of ["/partnersuche/aachen", "/partnersuche/magdeburg", "/partnersuche/karlsruhe"]) {
    const page = withCityPhoto(pages.find((item) => item.path === path));
    assert.equal(selectCityPhoto(page.images)?.src, CITY_PHOTOS[path].file, path);
  }
});

test("Zug no longer shows the unrelated tram photo or its credit", () => {
  const page = withCityPhoto(pages.find((item) => item.path === "/schweiz/zug"));
  assert.equal(selectCityPhoto(page.images)?.src, "/cities/zug.webp");
  assert.doesNotMatch(JSON.stringify(page.images) + page.contentHtml, /Zug-\(2\)\.jpg|fahrrad-zug-eisenbahn/);
});

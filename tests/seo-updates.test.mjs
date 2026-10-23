import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { applySeoUpdate } from "../lib/seo-updates.mjs";

const entries = JSON.parse(readFileSync(new URL("../data/magazine.json", import.meta.url), "utf8")).entries;

test("editorial updates preserve URLs, authors and publication dates from the import", () => {
  for (const path of ["/magazin/lesarion", "/magazin/lesbische-szenebars"]) {
    const source = entries.find((entry) => entry.path === path);
    const updated = applySeoUpdate(source);
    for (const key of ["id", "path", "canonical", "date", "author", "featuredImage"]) assert.deepEqual(updated[key], source[key]);
    assert.equal(updated.modified, "2026-10-23T12:00:00+02:00");
    for (const [, href] of updated.contentHtml.matchAll(/href="(\/magazin\/[^"?#]+)"/g)) {
      assert.ok(entries.some((entry) => entry.path === href.replace(/\/$/, "")), `missing article ${href}`);
    }
  }
  const untouched = { path: "/magazin/androgyn", contentHtml: "original" };
  assert.equal(applySeoUpdate(untouched), untouched);
});

test("Lesarion update replaces unsupported prices and prevents a stale spoken summary", () => {
  const updated = applySeoUpdate(entries.find((entry) => entry.slug === "lesarion"));
  assert.equal(updated.audioSummaryCurrent, false);
  assert.doesNotMatch(updated.contentHtml, /300\.000|7,95|50,04|★★★★|<audio/);
  assert.match(updated.contentHtml, /detail\.php\?id=87/);
  assert.match(updated.contentHtml, /detail\.php\?id=69/);
});

test("bar guide distinguishes party series and preserves original image credits", () => {
  const source = entries.find((entry) => entry.slug === "lesbische-szenebars");
  const updated = applySeoUpdate(source);
  assert.match(updated.contentHtml, /BEGiNE/);
  assert.match(updated.contentHtml, /SHE-BAR/);
  assert.match(updated.contentHtml, /wechselnden Locations/);
  assert.match(updated.contentHtml, /<details class="magazine-sources"><summary>/);
  assert.doesNotMatch(updated.contentHtml, /<details[^>]*\bopen\b/);
  const images = [...source.contentHtml.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  for (const image of images) assert.ok(updated.contentHtml.includes(image), "preserve imported media and credits");
});

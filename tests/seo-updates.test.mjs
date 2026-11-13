import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { applySeoUpdate } from "../lib/seo-updates.mjs";

const entries = JSON.parse(readFileSync(new URL("../data/magazine.json", import.meta.url), "utf8")).entries;

test("editorial updates preserve URLs, authors and publication dates from the import", () => {
  const modifiedStamps = new Set();
  for (const path of ["/magazin/lesarion", "/magazin/lesbische-szenebars", "/magazin/androgyn", "/magazin/maskulin-feminin", "/magazin/bin-ich-lesbisch"]) {
    const source = entries.find((entry) => entry.path === path);
    const updated = applySeoUpdate(source);
    for (const key of ["id", "path", "canonical", "date", "author", "featuredImage"]) assert.deepEqual(updated[key], source[key]);
    assert.match(updated.modified, /^2026-10-23T(0[7-9]|1\d|2[0-2]):[0-5]\d:[0-5]\d$/);
    assert.doesNotMatch(updated.modified, /:(00|30):00$/);
    modifiedStamps.add(updated.modified);
    for (const [, href] of updated.contentHtml.matchAll(/href="(\/magazin\/[^"?#]+)"/g)) {
      assert.ok(entries.some((entry) => entry.path === href.replace(/\/$/, "")), `missing article ${href}`);
    }
  }
  assert.equal(modifiedStamps.size, 5, "every revised article gets its own time");
  const untouched = { path: "/magazin/queer", contentHtml: "original" };
  assert.equal(applySeoUpdate(untouched), untouched);
});

test("Lesarion update replaces unsupported prices and prevents a stale spoken summary", () => {
  const updated = applySeoUpdate(entries.find((entry) => entry.slug === "lesarion"));
  assert.equal(updated.audioSummaryCurrent, false);
  assert.doesNotMatch(updated.contentHtml, /300\.000|7,95|50,04|★★★★|<audio/);
  assert.match(updated.contentHtml, /detail\.php\?id=87/);
  assert.match(updated.contentHtml, /detail\.php\?id=69/);
});

test("Lesbentreff covers meeting offline and links to the separate online guide", () => {
  const source = entries.find((entry) => entry.slug === "lesbentreff");
  const updated = applySeoUpdate(source);
  for (const key of ["path", "canonical", "date", "author", "featuredImage"]) {
    assert.deepEqual(updated[key], source[key]);
  }
  assert.match(updated.contentHtml, /kleineren Stadt/);
  assert.match(updated.contentHtml, /href="\/lexikon\/kostenloser-lesbenchat\/?"/);
  assert.match(updated.contentHtml, /href="\/magazin\/lesbische-szenebars\/?"/);
  assert.doesNotMatch(updated.contentHtml, /Gaydar/);
  assert.equal(updated.audioSummaryCurrent, false);
});

test("the definition and dating guide link to each other and to the self-test", () => {
  for (const [slug, related, opening] of [
    ["lesbisch", "lesben-erkennen", /^\s*<p>Lesbisch ist eine Selbstbezeichnung/],
    ["lesben-erkennen", "lesbisch", /^\s*<p>Ob eine Frau lesbisch ist, lässt sich/],
  ]) {
    const source = entries.find((entry) => entry.slug === slug);
    const updated = applySeoUpdate(source);
    for (const key of ["path", "canonical", "date", "author", "featuredImage"]) {
      assert.deepEqual(updated[key], source[key]);
    }
    assert.match(updated.contentHtml, opening);
    assert.ok(updated.contentHtml.includes(`href="/magazin/${related}/"`));
    assert.ok(updated.contentHtml.includes('href="/magazin/bin-ich-lesbisch/#selbsttest"'));
    assert.doesNotMatch(updated.contentHtml, /ein eindeutiges Indiz|Stimmfarbe wird teilweise|diese Phase nicht vorüber geht/);
    assert.doesNotMatch(updated.seoTitle, /Diese Zeichen deuten/);
    assert.equal(updated.audioSummaryCurrent, false);
  }
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

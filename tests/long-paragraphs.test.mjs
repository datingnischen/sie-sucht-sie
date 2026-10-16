import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const { MAX_PARAGRAPH_WORDS, splitLongParagraphs } = await import("../lib/long-paragraphs.ts");
const { magazineEntries } = await import("../lib/magazine.ts");
const { cleanImportedHtml } = await import("../components/editorial/imported-html.ts");
// lib/content.ts nutzt @/-Aliasse; die importierten Seiten werden daher roh geprüft, aufbereitet wie in den Seitenvorlagen.
const pagesCatalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));

const sentence = (index) => `Satz ${index} erklärt ruhig und sachlich, worauf du beim ersten Date mit einer Frau achten kannst.`;
const words = (html) => html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
const paragraphs = (html) => [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);

test("paragraphs over the word limit are split at sentence ends (Semrush: Absätze sind zu lang)", () => {
  const long = Array.from({ length: 18 }, (_, index) => sentence(index + 1)).join(" ");
  const parts = paragraphs(splitLongParagraphs(`<p>${long}</p>`));
  assert.ok(words(long) > MAX_PARAGRAPH_WORDS);
  assert.ok(parts.length >= 2);
  for (const part of parts) {
    assert.ok(words(part) <= MAX_PARAGRAPH_WORDS, part);
    assert.match(part, /^Satz \d+ .*\.$/);
  }
  assert.equal(parts.join(" "), long);
});

test("short paragraphs, links and abbreviations stay intact", () => {
  const short = `<p>${sentence(1)}</p>`;
  assert.equal(splitLongParagraphs(short), short);

  const withLink = Array.from({ length: 16 }, (_, index) =>
    index === 7 ? `Mehr dazu im <a href="/magazin/coming-out/">Ratgeber. Dort steht alles</a> ausführlich.` : sentence(index + 1),
  ).join(" ");
  const parts = paragraphs(splitLongParagraphs(`<p>${withLink}</p>`));
  assert.ok(parts.some((part) => part.includes(`<a href="/magazin/coming-out/">Ratgeber. Dort steht alles</a>`)));

  const abbreviations = Array.from({ length: 16 }, (_, index) => `Das kostet ca. 10 Euro, z. B. Bar ${index} bzw. Club.`).join(" ");
  for (const part of paragraphs(splitLongParagraphs(`<p>${abbreviations}</p>`))) {
    assert.doesNotMatch(part, /^(10|B\.|Club)/);
  }
});

test("magazine and imported pages contain no paragraph over the word limit", () => {
  const pages = [...magazineEntries.map((entry) => [entry.path, entry.contentHtml]), ...pagesCatalog.pages.map((page) => [page.path, splitLongParagraphs(cleanImportedHtml(page.contentHtml ?? ""))])];
  for (const [path, html] of pages) {
    for (const paragraph of paragraphs(html)) assert.ok(words(paragraph) <= MAX_PARAGRAPH_WORDS, `${path}: ${words(paragraph)} Wörter`);
  }
});

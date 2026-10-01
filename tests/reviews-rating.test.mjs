import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync(new URL("../data/pages.json", import.meta.url), "utf8"));
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

// Der ICONY-Text nennt 4,4 von 5 Sternen, darunter steht aber eine Zeile mit fünf Sterne-Emojis.
// Die Bewertungsseite muss die Emoji-Zeile entfernen und die Sterne aus der Zahl im Text zeichnen.
test("Bewertungsseite zeigt keine Sterne-Emojis, sondern die Bewertung aus dem Text", () => {
  const reviews = catalog.pages.find((page) => page.path === "/bewertungen-und-erfahrungen");
  assert.ok(reviews, "importierte Bewertungsseite fehlt");
  assert.match(reviews.contentHtml, /\d,\d von 5 Sternen/, "Bewertung im ICONY-Text nicht gefunden");

  const page = read("../components/about/reviews-page.tsx");
  const removeEmojiStars = page.match(/const removeEmojiStars = \(html: string\) => (.+);/);
  assert.ok(removeEmojiStars, "removeEmojiStars fehlt");
  assert.match(page, /dangerouslySetInnerHTML=\{\{ __html: removeEmojiStars\(/);
  assert.match(page, /ratingFromText\(/);

  // Die Filterregel muss die Emoji-Zeile im importierten Text tatsächlich treffen
  const strip = (html) => html.replace(/<p>\s*(?:⭐\s*)+<\/p>/g, " ");
  assert.ok(removeEmojiStars[1].includes("(?:⭐\\s*)+"), "Filterregel geändert – Test anpassen");
  assert.doesNotMatch(strip(reviews.contentHtml), /<p>\s*⭐/);
});

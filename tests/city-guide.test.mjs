import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildCityGuide, extractCredits, plainText, selectCityPhoto, topicFor } from "../lib/city-guide.mjs";

const pages = JSON.parse(fs.readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;
const cityPages = pages.filter((page) => page.type === "location" && page.path.split("/").length === 3);

function guideText(guide) {
  return plainText([
    guide.introHtml,
    ...guide.sections.map((section) => `<h2>${section.headingHtml}</h2>${section.html}`),
    guide.related.heading,
    ...guide.related.links.map((link) => link.name),
  ].join(" "));
}

test("the imported city texts stay word for word: every paragraph, list item and heading survives the chapter split", () => {
  for (const page of cityPages) {
    const photo = selectCityPhoto(page.images);
    const guide = buildCityGuide({ contentHtml: page.contentHtml, path: page.path, heroSrc: photo?.src });
    const text = guideText(guide);
    const blocks = [...page.contentHtml.matchAll(/<(p|li|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/g)]
      .map((match) => plainText(match[2]))
      .filter((value) => value && !/^Bildquelle/.test(value) && !/^https?:\/\//.test(value));
    for (const block of blocks) {
      if (block === page.path) continue;
      assert.ok(text.includes(block), `${page.path}: „${block.slice(0, 60)}…“ fehlt`);
    }
  }
});

test("wrappers, duplicate CTA wrappers, flags, statistic graphics and image credits are lifted out of the guide", () => {
  for (const page of cityPages) {
    const photo = selectCityPhoto(page.images);
    const guide = buildCityGuide({ contentHtml: page.contentHtml, path: page.path, heroSrc: photo?.src });
    const html = [guide.introHtml, ...guide.sections.map((section) => section.html)].join("");
    assert.doesNotMatch(html, /<\/?(?:div|section)\b/, page.path);
    assert.doesNotMatch(html, /Bildquelle/, page.path);
    assert.doesNotMatch(html, /<img[^>]*flagge/i, page.path);
    assert.doesNotMatch(html, /\/[^/"]*L\.jpg"/, page.path);
    assert.doesNotMatch(html, /<p>\s*<\/p>/, page.path);
    if (photo) assert.ok(!html.includes(photo.src), `${page.path}: Hero-Bild doppelt`);
  }
});

test("the related link list becomes chips and keeps its original heading", () => {
  const berlin = pages.find((page) => page.path === "/partnersuche/berlin");
  const guide = buildCityGuide({ contentHtml: berlin.contentHtml, path: berlin.path });
  assert.equal(guide.related.heading, "Andere interessante Orte für lesbische Singles:");
  assert.deepEqual(guide.related.links.map((link) => link.name), ["Kassel", "Duisburg", "München", "Österreich", "Schweiz"]);
  assert.ok(guide.related.links.find((link) => link.name === "Österreich").isHub);
  const zurich = pages.find((page) => page.path === "/schweiz/zuerich");
  const zGuide = buildCityGuide({ contentHtml: zurich.contentHtml, path: zurich.path });
  assert.equal(zGuide.related.heading, "Diese Städte könnten auch interessant für dich sein:");
  assert.equal(zGuide.related.links.length, 4);
  assert.ok(zGuide.sections.every((section) => !/interessant/.test(section.heading)));
});

test("chapters split at h2 and fall back to h3 for texts structured mainly with h3", () => {
  const vienna = pages.find((page) => page.path === "/oesterreich/wien");
  const guide = buildCityGuide({ contentHtml: vienna.contentHtml, path: vienna.path });
  assert.ok(guide.chapterCount >= 6);
  assert.ok(guide.sections.some((section) => section.level === 3 && section.heading === "Donaukanal – entspanntes Kennenlernen"));
  const aachen = pages.find((page) => page.path === "/partnersuche/aachen");
  const aGuide = buildCityGuide({ contentHtml: aachen.contentHtml, path: aachen.path });
  assert.equal(aGuide.chapterCount, 7);
  assert.ok(aGuide.sections.every((section) => section.level === 2));
});

test("image credits are extracted with a readable label", () => {
  const { credits, html } = extractCredits('<p>Text</p><hr/><p><small>Bildquelle: https://pixabay.com/de/photos/x-1/</small></p>');
  assert.deepEqual(credits, [{ url: "https://pixabay.com/de/photos/x-1/", label: "Pixabay" }]);
  assert.equal(html, "<p>Text</p>");
});

test("chapter symbols follow the keyword rules", () => {
  assert.equal(topicFor("Bars und Clubs auch für Lesben"), "bar");
  assert.equal(topicFor("CSD - ein Pflichttermin für jede Altersgruppe"), "event");
  assert.equal(topicFor("Köstlichkeiten teilen – Rösti, Schokolade und gemeinsame Momente"), "food");
  assert.equal(topicFor("Eine romantische Bootsfahrt mit Weitblick auf dem Zürichsee"), "boat");
  assert.equal(topicFor("Nordkette & Berg-Date"), "mountain");
  assert.equal(topicFor("Online-Dating für lesbische Frauen in Aachen"), "online");
  assert.equal(topicFor("Kultur & MuseumsQuartier"), "culture");
  assert.equal(topicFor("Lesbenstammtisch in der Vielfalt e.V."), "community");
  assert.equal(topicFor("Sie sucht Sie in Wien – Fazit"), "love");
  assert.equal(topicFor("Romantische Date-Ideen in Aachen"), "tip");
  assert.equal(topicFor("Das Postillion"), "place");
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildCityCards, removeLegacyCityLists } from "../lib/location-hub.mjs";

const catalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));
const pages = catalog.pages;

test("the German partnersuche hub exposes every city as a visual card", () => {
  const cards = buildCityCards(pages, "partnersuche");
  assert.equal(cards.length, 24);
  assert.deepEqual(cards.slice(0, 6).map((card) => card.name), ["Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart"]);
  for (const card of cards) {
    assert.match(card.path, /^\/partnersuche\/[a-z0-9-]+$/);
    assert.ok(card.name);
    assert.ok(card.teaser);
    if (card.image) {
      assert.match(card.image.src, /^https:\/\/static-cms\.icony-hosting\.de\//);
      assert.doesNotMatch(card.image.src, /statistik|statistics|flagge|singleboersen-ueberblick/i);
    }
  }
});

test("city cards use a shared representative hero image and location tracking", () => {
  const cards = buildCityCards(pages, "partnersuche");
  const stuttgart = cards.find((card) => card.path === "/partnersuche/stuttgart");
  assert.equal(stuttgart.image.src, "https://static-cms.icony-hosting.de/cms/D18BD92B8F841ABE2B527007F1BBE0F3ADB184D609DEE79C8D63AC63715B80EB/sie-sucht-sie-in-stuttgart.jpg");
  assert.equal(stuttgart.registrationUrl, "https://www.sie-sucht-sie.de/registration/?AID=location");
  assert.equal(cards.find((card) => card.path === "/partnersuche/augsburg").image, null);
});

test("the visual hub replaces all legacy city link lists without touching prose", () => {
  const hub = pages.find((page) => page.path === "/partnersuche");
  const cleaned = removeLegacyCityLists(hub.contentHtml);
  assert.doesNotMatch(cleaned, /<ul>[\s\S]*href=["']\/partnersuche\//i);
  assert.match(cleaned, /Willkommen bei/);
  assert.match(cleaned, /Kostenlos Lesben kennenlernen/);
  assert.doesNotMatch(cleaned, /sie-sucht-sie-de-titelbild/);
});

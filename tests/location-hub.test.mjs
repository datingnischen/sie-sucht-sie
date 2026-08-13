import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildCityCards, getHubPresentation, removeLegacyCityLists } from "../lib/location-hub.mjs";

const catalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));
const pages = catalog.pages;
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

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
  const cleaned = removeLegacyCityLists(hub.contentHtml, "partnersuche", hub.h1);
  assert.doesNotMatch(cleaned, /<ul>[\s\S]*href=["']\/partnersuche\//i);
  assert.match(cleaned, /Willkommen bei/);
  assert.match(cleaned, /Kostenlos Lesben kennenlernen/);
  assert.doesNotMatch(cleaned, /sie-sucht-sie-de-titelbild/);
});

test("the Swiss hub exposes all catalog cities with representative photography", () => {
  const cards = buildCityCards(pages, "schweiz");
  assert.equal(cards.length, 15);
  assert.deepEqual(cards.slice(0, 6).map((card) => card.name), ["Zürich", "Basel", "Bern", "Lausanne", "Luzern", "Zug"]);
  assert.equal(cards.find((card) => card.path === "/schweiz/basel").image.src.endsWith("/1000/Basel.jpg"), true);
  for (const card of cards) {
    assert.match(card.path, /^\/schweiz\/[a-z0-9-]+$/);
    assert.doesNotMatch(card.image?.src || "", /flagge|Schewiz-Flagge/i);
    assert.equal(card.registrationUrl, "https://www.sie-sucht-sie.de/registration/?AID=location");
  }
});

test("the Austrian hub exposes all catalog cities in a deliberate order", () => {
  const cards = buildCityCards(pages, "oesterreich");
  assert.equal(cards.length, 10);
  assert.deepEqual(cards.slice(0, 6).map((card) => card.name), ["Wien", "Graz", "Salzburg", "Innsbruck", "Linz", "Klagenfurt"]);
  for (const card of cards) {
    assert.match(card.path, /^\/oesterreich\/[a-z0-9-]+$/);
    assert.equal(card.image, null);
    assert.equal(card.registrationUrl, "https://www.sie-sucht-sie.de/registration/?AID=location");
  }
});

test("country hub cleanup removes only its superseded city navigation and duplicate heading", () => {
  for (const root of ["schweiz", "oesterreich"]) {
    const hub = pages.find((page) => page.path === `/${root}`);
    const cleaned = removeLegacyCityLists(hub.contentHtml, root, hub.h1);
    assert.doesNotMatch(cleaned, new RegExp(`<ul>[\\s\\S]*href=["']/${root}/`, "i"));
    assert.doesNotMatch(cleaned, new RegExp(`<h1>${hub.h1.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}</h1>`, "i"));
    assert.match(cleaned, /Partnersuche für lesbische Frauen/);
  }
});

test("country hubs expose country-specific public presentation copy", () => {
  assert.deepEqual(getHubPresentation("schweiz"), {
    kicker: "Schweiz entdecken",
    heading: "Wähle Deine Stadt in der Schweiz",
    intro: "Von Zürich bis Sion: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.",
    ctaTitle: "Deine Schweizer Stadt ist schon dabei.",
    ctaLabel: "Frauen in der Schweiz finden",
  });
  assert.deepEqual(getHubPresentation("oesterreich"), {
    kicker: "Österreich entdecken",
    heading: "Wähle Deine Stadt in Österreich",
    intro: "Von Wien bis Dornbirn: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.",
    ctaTitle: "Deine österreichische Stadt ist schon dabei.",
    ctaLabel: "Frauen in Österreich finden",
  });
});

test("long imported source URLs wrap inside the editorial content column", () => {
  assert.match(globalCss, /\.rich-content\s*\{[^}]*overflow-wrap\s*:\s*anywhere/i);
});

test("city cards disable motion when the visitor requests reduced motion", () => {
  assert.match(globalCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.city-tile img[^}]*transition:\s*none[^}]*transform:\s*none/i);
  assert.match(globalCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.city-tile-action[^}]*transition:\s*none[^}]*transform:\s*none/i);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CITY_POSTCODES,
  getCitySearchUrl,
} from "../lib/location-search.mjs";

const catalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));
const importedPageSource = await readFile(new URL("../app/[...slug]/page.tsx", import.meta.url), "utf8");
const cityPages = catalog.pages.filter((page) =>
  page.type === "location" && /^\/(partnersuche|oesterreich|schweiz)\/[a-z0-9-]+$/.test(page.path)
);

test("every catalog city route has one country-valid central postcode", () => {
  assert.equal(cityPages.length, 49);
  assert.deepEqual(
    Object.keys(CITY_POSTCODES).sort(),
    cityPages.map((page) => page.path).sort(),
  );

  const expectedCounts = { partnersuche: 24, oesterreich: 10, schweiz: 15 };
  for (const [root, count] of Object.entries(expectedCounts)) {
    const entries = Object.entries(CITY_POSTCODES).filter(([path]) => path.startsWith(`/${root}/`));
    assert.equal(entries.length, count);
    const pattern = root === "partnersuche" ? /^\d{5}$/ : /^\d{4}$/;
    for (const [path, postcode] of entries) {
      assert.match(path, new RegExp(`^/${root}/[a-z0-9-]+$`));
      assert.match(postcode, pattern);
    }
  }
});

test("city search URLs preserve exact postcode-first attribution wire order", () => {
  assert.equal(
    getCitySearchUrl("/partnersuche/dresden"),
    "https://www.sie-sucht-sie.de/suche/?plz=01067&AID=location",
  );
  assert.equal(
    getCitySearchUrl("/oesterreich/wien"),
    "https://www.sie-sucht-sie.de/suche/?plz=1010&AID=location",
  );
  assert.equal(
    getCitySearchUrl("/schweiz/zuerich"),
    "https://www.sie-sucht-sie.de/suche/?plz=8001&AID=location",
  );
});

test("city search URL construction fails closed for missing or malformed mappings", () => {
  assert.equal(getCitySearchUrl("/partnersuche/reutlingen"), null);
  assert.equal(getCitySearchUrl("/partnersuche"), null);
  assert.equal(getCitySearchUrl("/oesterreich"), null);
  assert.equal(getCitySearchUrl("/schweiz"), null);
  assert.equal(getCitySearchUrl("/lexikon/coming-out"), null);
  assert.equal(getCitySearchUrl("/partnersuche/berlin", { "/partnersuche/berlin": "1010" }), null);
  assert.equal(getCitySearchUrl("/oesterreich/wien", { "/oesterreich/wien": "01010" }), null);
  assert.equal(getCitySearchUrl("/schweiz/zuerich", { "/schweiz/zuerich": 8001 }), null);
  assert.equal(getCitySearchUrl("/schweiz/zuerich", { "/schweiz/zuerich": "80A1" }), null);
});

test("all 49 city routes resolve to unique, valid public search CTAs", () => {
  const urls = cityPages.map((page) => getCitySearchUrl(page.path));
  assert.equal(urls.length, 49);
  assert.equal(urls.every(Boolean), true);
  assert.equal(new Set(urls).size, 49);
  for (const url of urls) {
    assert.match(url, /^https:\/\/www\.sie-sucht-sie\.de\/suche\/\?plz=\d{4,5}&AID=location$/);
  }
});

test("the detail renderer wires the search CTA conditionally and keeps registration CTAs", () => {
  assert.match(importedPageSource, /getCitySearchUrl\(path\)/);
  assert.match(importedPageSource, /citySearchUrl\s*\?/);
  assert.match(importedPageSource, /href=\{citySearchUrl\}/);
  assert.match(importedPageSource, /registrationUrl\(path\)/);
  assert.doesNotMatch(importedPageSource, /href=["']https:\/\/www\.sie-sucht-sie\.de\/suche\/\?/);
});

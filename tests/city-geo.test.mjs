import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CITY_GEO, COUNTRY_BY_ROOT, cityGeo, distanceKm, nearestCities } from "../lib/city-geo.mjs";
import { getCountryMap } from "../lib/city-map.mjs";

const pages = JSON.parse(fs.readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;
const cityPaths = pages.filter((page) => page.type === "location" && page.path.split("/").length === 3).map((page) => page.path).sort();

// Grobe Landesgrenzen als Plausibilitätsrahmen (Breite, Länge).
const BOUNDS = {
  partnersuche: { lat: [47.2, 55.1], lon: [5.8, 15.1] },
  oesterreich: { lat: [46.3, 49.1], lon: [9.5, 17.2] },
  schweiz: { lat: [45.8, 47.9], lon: [5.9, 10.5] },
};

test("every one of the 49 city pages has coordinates and a region", () => {
  assert.equal(cityPaths.length, 49);
  assert.deepEqual(Object.keys(CITY_GEO).sort(), cityPaths);
  for (const [path, geo] of Object.entries(CITY_GEO)) {
    const root = path.split("/")[1];
    const bounds = BOUNDS[root];
    assert.ok(geo.lat >= bounds.lat[0] && geo.lat <= bounds.lat[1], `${path} lat`);
    assert.ok(geo.lon >= bounds.lon[0] && geo.lon <= bounds.lon[1], `${path} lon`);
    assert.ok(geo.region.length > 2, `${path} region`);
    assert.ok(geo.name.length > 1, `${path} name`);
  }
  assert.equal(cityGeo("/partnersuche/berlin/").name, "Berlin");
});

test("haversine distances match known air-line distances", () => {
  const km = (a, b) => distanceKm(CITY_GEO[a], CITY_GEO[b]);
  assert.ok(Math.abs(km("/partnersuche/berlin", "/partnersuche/hamburg") - 255) <= 5);
  assert.ok(Math.abs(km("/partnersuche/muenchen", "/oesterreich/salzburg") - 117) <= 5);
  assert.ok(Math.abs(km("/schweiz/zuerich", "/schweiz/bern") - 95) <= 5);
  assert.ok(Math.abs(km("/oesterreich/wien", "/oesterreich/graz") - 145) <= 5);
  assert.equal(km("/partnersuche/koeln", "/partnersuche/koeln"), 0);
});

test("nearest city pages are sorted, exclude the page itself and cross borders when close", () => {
  const near = nearestCities("/schweiz/basel", 5);
  assert.equal(near.length, 5);
  assert.ok(near.every((entry) => entry.path !== "/schweiz/basel"));
  assert.deepEqual([...near].sort((a, b) => a.km - b.km), near);
  assert.ok(near.some((entry) => entry.path === "/partnersuche/freiburg"), "Freiburg liegt nah an Basel");
  assert.ok(nearestCities("/oesterreich/dornbirn", 3).some((entry) => entry.path === "/schweiz/st-gallen"));
  assert.deepEqual(nearestCities("/partnersuche/reutlingen"), []);
});

test("hub maps place every city inside the drawing and label most of them", () => {
  for (const root of Object.keys(COUNTRY_BY_ROOT)) {
    const map = getCountryMap(root);
    assert.equal(map.cities.length, cityPaths.filter((path) => path.startsWith(`/${root}/`)).length);
    for (const city of map.cities) {
      assert.ok(city.x > 0 && city.x < map.width && city.y > 0 && city.y < map.height, `${city.path} inside map`);
    }
    const labelled = map.cities.filter((city) => city.label).length;
    assert.ok(labelled / map.cities.length >= 0.6, `${root}: ${labelled} labels`);
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { nearestCities } from "../lib/city-geo.mjs";
import { selectCityPhoto } from "../lib/city-guide.mjs";

// „Frauen in Reichweite“ ersetzt die früheren Related-Cards: nächste Stadtseiten mit Thumbnail und km-Balken.
const pages = JSON.parse(fs.readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;
const cityPages = pages.filter((page) => page.type === "location" && page.path.split("/").length === 3);

test("Vienna shows the five nearest city pages with real scene photos instead of statistic graphics", () => {
  const near = nearestCities("/oesterreich/wien", 5);
  assert.equal(near.length, 5);
  assert.deepEqual(near.map((entry) => entry.path).slice(0, 2), ["/oesterreich/sankt-poelten", "/oesterreich/graz"]);
  for (const entry of near) {
    const page = pages.find((item) => item.path === entry.path);
    const photo = selectCityPhoto(page.images);
    assert.match(photo?.src || "", /2\.jpg$/i);
    assert.doesNotMatch(photo?.src || "", /statistik|community|flagge|testbericht/i);
  }
});

test("neighbour thumbnails stay inside the existing public page inventory and never show flags or statistic graphics", () => {
  for (const page of cityPages) {
    for (const entry of nearestCities(page.path, 5)) {
      const source = pages.find((item) => item.path === entry.path);
      assert.ok(source, entry.path);
      const photo = selectCityPhoto(source.images);
      if (!photo) continue;
      assert.ok(source.images.some((image) => image.src === photo.src));
      assert.doesNotMatch(photo.src, /flagge|statistik|statistics|\/[^/]*L\.jpg$|titelbild/);
    }
  }
});

test("neighbour renderer provides lazy thumbnails with alt text and a deliberate fallback", () => {
  const source = fs.readFileSync(new URL("../components/location/location-city-page.tsx", import.meta.url), "utf8");
  assert.match(source, /nearestCities\(path, 5\)/);
  assert.match(source, /className="sc-near-row"/);
  assert.match(source, /alt=\{`Stadtansicht von \$\{entry\.name\}`\} loading="lazy"/);
  assert.match(source, /sc-near-ph/);
});

test("neighbour rows have cropped media, visible focus and reduced-motion protection", () => {
  const css = fs.readFileSync(new URL("../components/location/sc-city.css", import.meta.url), "utf8");
  assert.match(css, /\.sc-near-row img,\s*\.sc-near-ph\s*\{[^}]*object-fit: cover/);
  assert.match(css, /\.sc-near-row:focus-visible\s*\{[^}]*box-shadow:/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.sc-near-row[\s\S]*transition: none/);
});

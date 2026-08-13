import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildRelatedCards } from "../lib/related-cards.mjs";

const pages = JSON.parse(fs.readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;

test("Vienna related cards use six existing Austrian preview scenes instead of statistic graphics", () => {
  const cards = buildRelatedCards(pages, "/oesterreich/wien", "oesterreich");
  assert.equal(cards.length, 6);
  assert.deepEqual(cards.map((card) => card.path), [
    "/oesterreich/graz",
    "/oesterreich/linz",
    "/oesterreich/salzburg",
    "/oesterreich/innsbruck",
    "/oesterreich/klagenfurt",
    "/oesterreich/villach",
  ]);
  for (const card of cards) {
    assert.match(card.image?.src || "", /2\.jpg$/i);
    assert.ok(card.image?.alt);
    assert.doesNotMatch(card.image?.src || "", /statistik|community|profil|flagge|testbericht/i);
  }
});

test("related card images stay inside the existing public page inventory", () => {
  for (const root of ["partnersuche", "schweiz", "oesterreich"]) {
    const current = pages.find((page) => page.type === "location" && page.path.startsWith(`/${root}/`));
    const cards = buildRelatedCards(pages, current.path, root);
    for (const card of cards) {
      const source = pages.find((page) => page.path === card.path);
      assert.ok(source);
      if (card.image) assert.ok(source.images.some((image) => image.src === card.image.src));
    }
  }
});

test("related card renderer provides lazy thumbnails and a deliberate fallback", () => {
  const source = fs.readFileSync(new URL("../components/related-card-section.tsx", import.meta.url), "utf8");
  assert.match(source, /loading="lazy"/);
  assert.match(source, /className="related-card-media"/);
  assert.match(source, /related-card-fallback/);
  assert.match(source, /alt=\{card\.image\.alt\}/);
});

test("compact related cards have cropped media, visible focus and reduced-motion protection", () => {
  const css = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.related-card-media img\s*\{[^}]*object-fit:cover/i);
  assert.match(css, /\.related-grid a\.related-card\s*\{[^}]*min-width:0/i);
  assert.match(css, /@media\(max-width:720px\)\{\.related-card-grid\{grid-template-columns:minmax\(0,1fr\)/i);
  assert.match(css, /\.related-card:focus-visible\s*\{[^}]*outline:/i);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{[^}]*\.related-grid a\.related-card\{[^}]*transition:none/i);
});

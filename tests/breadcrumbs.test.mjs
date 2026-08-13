import test from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbs, buildBreadcrumbSchema } from "../lib/breadcrumbs.mjs";

test("Austrian city pages expose a linked Start / Österreich / Wien hierarchy", () => {
  assert.deepEqual(buildBreadcrumbs("/oesterreich/wien"), [
    { name: "Start", path: "/" },
    { name: "Österreich", path: "/oesterreich" },
    { name: "Wien", path: "/oesterreich/wien" },
  ]);
});

test("regional breadcrumb names preserve German spelling", () => {
  assert.deepEqual(buildBreadcrumbs("/schweiz/st-gallen").map((item) => item.name), ["Start", "Schweiz", "St. Gallen"]);
  assert.deepEqual(buildBreadcrumbs("/partnersuche/muenchen").map((item) => item.name), ["Start", "Partnersuche", "München"]);
});

test("breadcrumb presentation is semantic, keyboard visible and mobile safe", async () => {
  const pageSource = await import("node:fs").then(({ readFileSync }) => readFileSync(new URL("../app/[...slug]/page.tsx", import.meta.url), "utf8"));
  const css = await import("node:fs").then(({ readFileSync }) => readFileSync(new URL("../app/globals.css", import.meta.url), "utf8"));
  assert.match(pageSource, /<nav className="breadcrumbs" aria-label="Breadcrumb"><ol>/);
  assert.match(pageSource, /aria-current="page"/);
  assert.match(css, /\.breadcrumbs ol\s*\{[^}]*display:flex[^}]*flex-wrap:wrap/i);
  assert.match(css, /\.breadcrumbs a:focus-visible\s*\{[^}]*outline:/i);
});

test("breadcrumb structured data uses canonical absolute item URLs", () => {
  assert.deepEqual(buildBreadcrumbSchema("/oesterreich/wien"), {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: "https://www.sie-sucht-sie.de/" },
      { "@type": "ListItem", position: 2, name: "Österreich", item: "https://www.sie-sucht-sie.de/oesterreich" },
      { "@type": "ListItem", position: 3, name: "Wien", item: "https://www.sie-sucht-sie.de/oesterreich/wien" },
    ],
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbs, buildBreadcrumbSchema } from "../lib/breadcrumbs.mjs";
import { buildPageEntityGraph } from "../lib/page-entities.mjs";

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

test("top-level editorial breadcrumbs use catalog labels instead of implementation slugs", () => {
  assert.deepEqual(buildBreadcrumbs("/faq", "Häufige Fragen").map((item) => item.name), ["Start", "Häufige Fragen"]);
  assert.deepEqual(buildBreadcrumbs("/fragenflirt.html", "Fragenflirt").map((item) => item.name), ["Start", "Fragenflirt"]);
  assert.equal(buildBreadcrumbSchema("/sicherheit-und-datenschutz.html", "Sicherheit und Datenschutz").itemListElement.at(-1).name, "Sicherheit und Datenschutz");
});

test("breadcrumb structured data uses canonical absolute item URLs", () => {
  assert.deepEqual(buildBreadcrumbSchema("/oesterreich/wien"), {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: "https://www.sie-sucht-sie.de/" },
      { "@type": "ListItem", position: 2, name: "Österreich", item: "https://www.sie-sucht-sie.de/oesterreich/" },
      { "@type": "ListItem", position: 3, name: "Wien", item: "https://www.sie-sucht-sie.de/oesterreich/wien/" },
    ],
  });
});

test("breadcrumb list joins the page entity graph and is referenced by the WebPage", () => {
  const canonical = "https://www.sie-sucht-sie.de/partnersuche/hamburg/";
  const graph = buildPageEntityGraph(
    { canonical, h1: "Hamburg", description: "Frauen in Hamburg kennenlernen." },
    { breadcrumb: buildBreadcrumbSchema("/partnersuche/hamburg") },
  );
  const webpage = graph["@graph"].find((node) => node["@id"] === `${canonical}#webpage`);
  const breadcrumb = graph["@graph"].find((node) => node["@type"] === "BreadcrumbList");
  assert.deepEqual(webpage.breadcrumb, { "@id": `${canonical}#breadcrumb` });
  assert.equal(breadcrumb["@id"], `${canonical}#breadcrumb`);
  assert.equal(breadcrumb["@context"], undefined);
  assert.equal(breadcrumb.itemListElement.at(-1).item, canonical);
});

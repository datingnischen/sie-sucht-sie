import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import catalog from "../data/pages.json" with { type: "json" };
import { buildPageEntityGraph, serializePageEntityGraph } from "../lib/page-entities.mjs";

const SITE = "https://www.sie-sucht-sie.de";

test("imported article fragments do not duplicate the page main landmark or h1", () => {
  const offenders = catalog.pages.filter((page) => page.type !== "platform" && /<(?:main|h1)\b/i.test(page.contentHtml));
  assert.deepEqual(offenders.map((page) => page.path), []);
});

test("lexicon routes remain factual canonical WebPages without unsupported term claims", () => {
  const graph = buildPageEntityGraph({
    path: "/lexikon/kostenloser-lesbenchat",
    canonical: `${SITE}/lexikon/kostenloser-lesbenchat`,
    type: "lexicon",
    h1: "Kostenloser Lesbenchat",
    description: "Was ein kostenloser Lesbenchat bietet und worauf Frauen beim Kennenlernen achten können.",
  });
  assert.equal(graph["@context"], "https://schema.org");
  const webpage = graph["@graph"].find((node) => node["@type"] === "WebPage");
  assert.deepEqual(webpage, {
    "@type": "WebPage",
    "@id": `${SITE}/lexikon/kostenloser-lesbenchat#webpage`,
    url: `${SITE}/lexikon/kostenloser-lesbenchat`,
    name: "Kostenloser Lesbenchat",
    description: "Was ein kostenloser Lesbenchat bietet und worauf Frauen beim Kennenlernen achten können.",
    inLanguage: "de-DE",
    isPartOf: { "@id": `${SITE}/#website` },
  });
  assert.equal(graph["@graph"].some((node) => node["@type"] === "DefinedTerm"), false);
  assert.equal(webpage.mainEntity, undefined);
});

test("location pages stay factual WebPages without invented Place or Article claims", () => {
  const graph = buildPageEntityGraph({ path: "/oesterreich/wien", canonical: `${SITE}/oesterreich/wien`, type: "location", h1: "Lesbisch in Wien", description: "Frauen in Wien kennenlernen." });
  const types = graph["@graph"].map((node) => node["@type"]);
  assert.deepEqual(types, ["WebSite", "WebPage"]);
  assert.doesNotMatch(JSON.stringify(graph), /Article|Place|author|datePublished/);
});

test("JSON-LD serialization escapes HTML tag boundaries", () => {
  const graph = buildPageEntityGraph({ path: "/lexikon/test", canonical: `${SITE}/lexikon/test`, type: "lexicon", h1: "Test", description: "</script><script>alert(1)</script>" });
  const serialized = serializePageEntityGraph(graph);
  assert.doesNotMatch(serialized, /</);
  assert.match(serialized, /\\u003c\/script>/);
});

test("llms.txt is concise, canonical and does not claim to control model training", () => {
  const source = fs.readFileSync(new URL("../app/llms.txt/route.ts", import.meta.url), "utf8");
  assert.match(source, /https:\/\/www\.sie-sucht-sie\.de\/sitemap\.xml/);
  for (const path of ["/partnersuche", "/oesterreich", "/schweiz", "/lexikon"]) assert.match(source, new RegExp(`https://www\\.sie-sucht-sie\\.de${path}`));
  assert.match(source, /Content-Type[^\n]*text\/plain; charset=utf-8/i);
  assert.match(source, /export const dynamic = "force-static"/);
  assert.doesNotMatch(source, /training|trainingsdaten|garantiert|ranking/i);
});

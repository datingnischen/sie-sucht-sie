import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { cleanQuery, htmlToText, normalizeSearchText, prepareSearchDocument, searchDocuments, SITE_SEARCH_MAX_RESULTS, SITE_SEARCH_PATH } from "../lib/site-search.mjs";
import { classifyPath } from "../lib/site-contract.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(path, import.meta.url));

test("site search lives below the about area, never on the ICONY path /suche", () => {
  assert.equal(SITE_SEARCH_PATH, "/ueber-uns/suche");
  assert.ok(exists("../app/ueber-uns/suche/page.tsx"));
  assert.ok(!exists("../app/suche"), "no root-level /suche route");
  assert.equal(classifyPath("/suche"), "platform");
  assert.equal(classifyPath(SITE_SEARCH_PATH), "editorial");
  const catalog = JSON.parse(read("../data/pages.json"));
  assert.ok(!catalog.pages.some((page) => page.path === SITE_SEARCH_PATH), "no imported about page collides with the search route");
});

test("search page is noindex, follow with a query-free canonical and stays out of the sitemap", () => {
  const page = read("../app/ueber-uns/suche/page.tsx");
  assert.match(page, /robots: \{ index: false, follow: true \}/);
  assert.match(page, /publicUrl\(SITE_SEARCH_PATH\)/);
  assert.match(page, /alternates: \{ canonical \}/);
  assert.doesNotMatch(page, /articleUpdatedDate|modified|toLocaleDateString/);
  assert.doesNotMatch(read("../app/sitemap.ts"), /SITE_SEARCH_PATH|suche/);
});

test("header, footer and about hub link the search via the shared path", () => {
  const shell = read("../components/site-shell.tsx");
  assert.match(shell, /className="header-search" href=\{SITE_SEARCH_PATH\}/);
  assert.match(read("../app/ueber-uns/page.tsx"), /<SiteSearchForm /);
  const form = read("../components/site-search-form.tsx");
  assert.match(form, /action=\{withTrailingSlash\(SITE_SEARCH_PATH\)\}/);
  assert.match(form, /method="get"/);
  assert.match(form, /name="q"/);
});

test("normalization folds umlauts, ß and diacritics", () => {
  assert.equal(normalizeSearchText("Zürich"), "zuerich");
  assert.equal(normalizeSearchText("ZUERICH"), "zuerich");
  assert.equal(normalizeSearchText("Straße"), "strasse");
  assert.equal(normalizeSearchText("Café Crème"), "cafe creme");
  assert.equal(htmlToText("<p>Kaffee &amp; Kuchen</p><script>x()</script>"), "Kaffee & Kuchen");
  assert.equal(cleanQuery(["  Köln  ", "x"]), "Köln");
});

test("title hits rank before text hits and results are capped", () => {
  const docs = [
    prepareSearchDocument({ section: "Magazin", title: "Ausgehen am Rhein", excerpt: "", text: "Ein Abend in Köln", href: "/magazin/rhein/" }),
    prepareSearchDocument({ section: "Stadt", title: "Sie sucht Sie in Köln", excerpt: "Frauen aus Köln", text: "", href: "/partnersuche/koeln/" }),
  ];
  const results = searchDocuments(docs, "koeln");
  assert.deepEqual(results.map((result) => result.href), ["/partnersuche/koeln/", "/magazin/rhein/"]);
  assert.deepEqual(searchDocuments(docs, "koeln berlin"), []);
  const many = Array.from({ length: 80 }, (_, index) => prepareSearchDocument({ section: "Magazin", title: `Tipp ${index}`, href: `/magazin/t${index}/` }));
  assert.equal(searchDocuments(many, "tipp").length, SITE_SEARCH_MAX_RESULTS);
});

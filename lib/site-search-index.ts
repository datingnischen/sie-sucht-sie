import { publicPages } from "./content";
import { magazineEntries } from "./magazine";
import { withTrailingSlash } from "./site-contract.mjs";
import { htmlToText, prepareSearchDocument } from "./site-search.mjs";

// Suchindex aus den vorhandenen Snapshots (data/pages.json, data/magazine.json) – kein Live-Request pro Anfrage.
// Enthalten: Städte- und Regionsseiten, Lexikon und Magazin. ICONY-Plattformseiten bleiben draußen.
function locationSection(path: string) {
  return /^\/(partnersuche|oesterreich|schweiz)$/.test(path) ? "Region" : "Stadt";
}

const pageDocuments = publicPages
  .filter((page) => page.type === "location" || page.type === "lexicon")
  .map((page) => prepareSearchDocument({
    section: page.type === "location" ? locationSection(page.path) : "Lexikon",
    title: page.type === "location" ? page.title : page.h1,
    excerpt: page.description,
    text: `${page.h1} ${htmlToText(page.contentHtml)}`,
    href: withTrailingSlash(page.path),
  }));

const magazineDocuments = magazineEntries.map((entry) => prepareSearchDocument({
  section: "Magazin",
  title: entry.title,
  excerpt: entry.description,
  text: `${entry.categories.map((category) => category.name).join(" ")} ${htmlToText(entry.contentHtml)}`,
  href: withTrailingSlash(entry.path),
}));

export const siteSearchDocuments = [...pageDocuments, ...magazineDocuments];

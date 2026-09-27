// Seitensuche unter "Über uns". /suche gehört auf der Live-Domain der ICONY-Plattform,
// deshalb liegt die Suche neben dem Über-uns-Bereich, den der nginx an Next.js durchreicht.
import { ABOUT_ROOT_PATH } from "./about-pages.mjs";

export const SITE_SEARCH_PATH = `${ABOUT_ROOT_PATH}/suche`;
export const SITE_SEARCH_MAX_RESULTS = 50;
export const SITE_SEARCH_MAX_QUERY = 100;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeEntities(text = "") {
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const value = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Sichtbarer Text aus importiertem HTML (ohne Skripte, Styles und Tags). */
export function htmlToText(html = "") {
  return decodeEntities(String(html)
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Kleinschreibung, ä/ö/ü/ß ≙ ae/oe/ue/ss, übrige Diakritika entfernt. */
export function normalizeSearchText(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function cleanQuery(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.replace(/\s+/g, " ").trim().slice(0, SITE_SEARCH_MAX_QUERY) : "";
}

/**
 * @param {{ section: string, title: string, excerpt?: string, text?: string, href: string }} doc
 */
export function prepareSearchDocument(doc) {
  const title = decodeEntities(doc.title).trim();
  const excerpt = decodeEntities(doc.excerpt || "").trim();
  const text = doc.text || "";
  return {
    ...doc,
    title,
    excerpt,
    normTitle: ` ${normalizeSearchText(title)} `,
    normExcerpt: ` ${normalizeSearchText(excerpt)} `,
    normText: ` ${normalizeSearchText(text)} `,
  };
}

function snippet(doc, terms) {
  if (doc.excerpt) return shorten(doc.excerpt);
  const text = doc.text || "";
  const lower = normalizeSearchText(text);
  const index = terms.length ? lower.indexOf(terms[0]) : -1;
  // Normalisierter Text ist nur ungefähr gleich lang; für einen Auszug reicht das.
  const start = index > 60 ? Math.max(0, index - 60) : 0;
  return shorten(`${start ? "… " : ""}${text.slice(start)}`);
}

function shorten(text, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).trim()} …`;
}

/**
 * Durchsucht vorbereitete Dokumente. Jeder Suchbegriff muss vorkommen;
 * Titeltreffer zählen mehr als Treffer im Auszug oder Text.
 */
// Bei gleicher Punktzahl stehen Städte und Regionen vor Lexikon und Magazin.
const SECTION_ORDER = ["Stadt", "Region", "Lexikon", "Magazin"];
const sectionRank = (section) => { const index = SECTION_ORDER.indexOf(section); return index < 0 ? SECTION_ORDER.length : index; };

export function searchDocuments(documents, query, limit = SITE_SEARCH_MAX_RESULTS) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const terms = [...new Set(normalized.split(" ").filter(Boolean))];
  const phrase = ` ${normalized}`;
  const results = [];
  for (const doc of documents) {
    let score = 0;
    let matchesAll = true;
    for (const term of terms) {
      const word = ` ${term}`;
      let termScore = 0;
      if (doc.normTitle.includes(word)) termScore += doc.normTitle.includes(`${word} `) ? 12 : 10;
      else if (doc.normTitle.includes(term)) termScore += 6;
      if (doc.normExcerpt.includes(term)) termScore += 3;
      if (doc.normText.includes(term)) termScore += 1;
      if (!termScore) { matchesAll = false; break; }
      score += termScore;
    }
    if (!matchesAll) continue;
    if (terms.length > 1 && doc.normTitle.includes(phrase)) score += 8;
    if (doc.normTitle.trim() === normalized) score += 20;
    results.push({ doc, score });
  }
  return results
    .sort((a, b) => b.score - a.score || sectionRank(a.doc.section) - sectionRank(b.doc.section) || a.doc.title.localeCompare(b.doc.title, "de"))
    .slice(0, limit)
    .map(({ doc, score }) => ({ section: doc.section, title: doc.title, href: doc.href, excerpt: snippet(doc, terms), score }));
}

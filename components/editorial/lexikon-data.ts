import { getFamilyPages, type ImportedPage } from "@/lib/content";
import { getMagazineEntry, type MagazineEntry } from "@/lib/magazine";
import { cleanImportedHtml, readingMinutes, splitSections, stripTags } from "./imported-html";

/** Stichwort je Eintrag – kurz wie im Magazin-Glossar, dient als Wörterbuch-Kopf und für die A–Z-Sortierung. */
const TERMS: Record<string, string> = {
  lesbenseiten: "Lesbenseiten",
  "fuer-abenteuer": "Abenteuer",
  "fuer-beziehung": "Beziehung",
  lesbencommunity: "Lesbencommunity",
  "die-regenbogenfahne": "Regenbogenfahne",
  "seitensprung-finden": "Seitensprung",
  "kostenloser-lesbenchat": "Lesbenchat",
  "partnersuche-im-internet": "Partnersuche im Internet",
  "frauen-chat-aus-der-schweiz": "Frauen-Chat Schweiz",
  "singleboersen-und-fremdgehen": "Fremdgehen",
};

/** Passende Begriffsartikel im Magazin je Lexikon-Eintrag (nur vorhandene werden gezeigt). */
const MAGAZINE_LINKS: Record<string, string[]> = {
  lesbenseiten: ["lesbisch", "lesbische-facebook-seiten-und-gruppen", "bin-ich-lesbisch"],
  "fuer-abenteuer": ["girlflirt", "lesben-sex", "lesbische-beziehung"],
  "fuer-beziehung": ["lesbische-beziehung", "sie-sucht-sie-ueber-50", "die-ex-zurueckgewinnen"],
  lesbencommunity: ["lesbische-facebook-seiten-und-gruppen", "lesbische-szenebars", "csd"],
  "die-regenbogenfahne": ["lesbenflagge", "csd", "lgbt"],
  "seitensprung-finden": ["lesbische-beziehung", "girlflirt", "lesben-sex"],
  "kostenloser-lesbenchat": ["girlflirt", "lesbische-facebook-seiten-und-gruppen", "bin-ich-lesbisch"],
  "partnersuche-im-internet": ["bin-ich-lesbisch", "lesbische-beziehung", "sie-sucht-sie-ueber-50"],
  "frauen-chat-aus-der-schweiz": ["lesbische-szenebars", "girlflirt", "queer"],
  "singleboersen-und-fremdgehen": ["lesbische-beziehung", "die-ex-zurueckgewinnen", "queer"],
};
const MAGAZINE_FALLBACK = ["queer", "lesbisch", "bisexuell-darum-ist-jede-frau-etwas-bi"];

/** Begriffsartikel aus dem Magazin für die Brücke auf der Lexikon-Übersicht. */
const MAGAZINE_TERMS_FEATURED = ["queer", "bisexuell-darum-ist-jede-frau-etwas-bi", "pansexualitaet", "demisexualitaet"];
const MAGAZINE_TERMS_MORE = ["asexualitaet", "lesbisch", "lgbt", "lesbenflagge", "genderfluid", "cisgender", "androgyn", "geschlechtsidentitaet", "intersexuell", "outing-und-coming-out-was-ist-hinterher-versteckt"];
export const GLOSSARY_PATH = "/magazin/glossar";

export type LexikonTerm = {
  path: string;
  slug: string;
  term: string;
  letter: string;
  h1: string;
  description: string;
  image: { src: string; alt: string } | undefined;
  minutes: number;
  chapters: number;
};

const slugOf = (path: string) => path.split("/").filter(Boolean).at(-1) || "";

function fallbackTerm(page: ImportedPage) {
  return page.h1.split(/\s[-–]\s/)[0].replace(/^(Die|Der|Das)\s+/, "").trim();
}

export function termFor(page: ImportedPage): LexikonTerm {
  const slug = slugOf(page.path);
  const term = TERMS[slug] || fallbackTerm(page);
  const html = cleanImportedHtml(page.contentHtml);
  return {
    path: page.path,
    slug,
    term,
    letter: term.charAt(0).toLocaleUpperCase("de-DE"),
    h1: page.h1,
    description: page.description,
    image: page.images[0],
    minutes: readingMinutes(html),
    chapters: splitSections(html).sections.length,
  };
}

export function lexikonTerms() {
  return getFamilyPages("lexikon").map(termFor).sort((a, b) => a.term.localeCompare(b.term, "de"));
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function existing(slugs: string[]) {
  return slugs.map((slug) => getMagazineEntry(`/magazin/${slug}`)).filter((entry): entry is MagazineEntry => Boolean(entry));
}

export function magazineLinksFor(slug: string, limit = 3) {
  const wanted = [...(MAGAZINE_LINKS[slug] || []), ...MAGAZINE_FALLBACK];
  return existing([...new Set(wanted)]).slice(0, limit);
}

export function magazineTermBridge() {
  const glossary = getMagazineEntry(GLOSSARY_PATH);
  const glossaryCount = glossary ? (glossary.contentHtml.match(/<a\s[^>]*href=/g) || []).length : 0;
  const glossaryLetters = glossary ? [...glossary.contentHtml.matchAll(/<p><strong>([A-ZÄÖÜ])<\/strong>/g)].map((match) => match[1]) : [];
  return {
    glossary: glossary ? { path: glossary.path, title: glossary.title, count: glossaryCount, letters: glossaryLetters } : null,
    featured: existing(MAGAZINE_TERMS_FEATURED),
    more: existing(MAGAZINE_TERMS_MORE),
  };
}

/** Kurzform eines Magazintitels für Chips („Queer – Definition …“ → „Queer“). */
export function shortMagazineTitle(entry: MagazineEntry) {
  return stripTags(entry.title).split(/\s[-–]\s|\?|:/)[0].replace(/^(Was ist|Was bedeutet|Was bedeuted|Die|Ratgeber zu)\s+/i, "").replace(/[-–]\s*$/, "").trim();
}

/** Liest die Linkliste der Lexikon-Übersicht: Linktext und Erklärung je Eintrag (Wortlaut bleibt). */
export function parseLexikonIndex(html: string) {
  const list = html.match(/<ul>([\s\S]*?)<\/ul>/i);
  if (!list) return { before: html, after: "", items: new Map<string, { label: string; text: string }>() };
  const items = new Map<string, { label: string; text: string }>();
  for (const [, inner] of list[1].matchAll(/<li>([\s\S]*?)<\/li>/gi)) {
    const link = inner.match(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>([\s\S]*)/i);
    if (!link) continue;
    const path = link[1].replace(/\/$/, "");
    const label = stripTags(link[2]).replace(/\s*:\s*$/, "");
    const text = stripTags(link[3]).replace(/^:\s*/, "");
    items.set(path, { label, text });
  }
  const index = list.index ?? 0;
  return { before: html.slice(0, index), after: html.slice(index + list[0].length), items };
}

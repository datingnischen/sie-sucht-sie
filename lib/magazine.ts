import catalog from "../data/magazine.json" with { type: "json" };
import { absolutizeAssetUrls, staticAsset } from "./static-asset.mjs";
import { applyTextCorrections, MAGAZINE_CORRECTIONS } from "./text-corrections.mjs";
import { withImageAlts } from "./image-alt.mjs";
import { fixTypos, limitStrong, withoutEmptyHeadings } from "./html-cleanup.mjs";
import { splitLongParagraphs } from "./long-paragraphs.ts";
import { withUniqueEntryLinks } from "./link-targets.mjs";
import { slashInternalLinks, withTrailingSlash } from "./site-contract.mjs";

export type MagazineEntry = {
  id: number;
  type: "post" | "page";
  status: "publish";
  slug: string;
  path: string;
  canonical: string;
  sourceUrl: string;
  title: string;
  /** Nur <title>; die Überschrift bleibt title. */
  seoTitle?: string;
  description: string;
  date: string;
  modified: string;
  author: { id: number; name: string; slug: string; description: string } | null;
  featuredImage: string | null;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  contentHtml: string;
};

export type MagazineAttachment = {
  id: number;
  slug: string;
  path: string;
  canonical: string;
  targetType: "entry" | "asset";
  target: string;
};

export type MagazineRetiredPath = { path: string; target: string };

export type MagazineCategory = { id: number; name: string; slug: string; count: number; description: string };
export type MagazineAuthor = { id: number; name: string; slug: string; description: string };
type MagazineAsset = { localPath: string; legacyPaths: string[] };

export const magazineCategories = catalog.categories as MagazineCategory[];

/**
 * Editorial category fixes on top of the WordPress snapshot, keyed by post slug.
 * WordPress filed these guides under "Lesbenportale", which is reserved for portal reviews.
 */
const CATEGORY_CORRECTIONS: Record<string, string[]> = {
  "spaetes-coming-out-frauen": ["ratgeber"],
  "vaginale-selbsttests-dating": ["ratgeber"],
};

function withCategoryCorrections(entry: MagazineEntry): MagazineEntry {
  const slugs = CATEGORY_CORRECTIONS[entry.slug];
  if (!slugs) return entry;
  const categories = slugs.map((slug) => {
    const category = magazineCategories.find((item) => item.slug === slug);
    if (!category) throw new Error(`Unknown magazine category ${slug}`);
    return { id: category.id, name: category.name, slug: category.slug };
  });
  return { ...entry, categories };
}

// Medien kommen vom Asset-Host, weil der nginx vor der Live-Domain nur Seitenrouten durchreicht.
// Seiten-URLs (Canonical, interne Links) enden auf "/" wie die ICONY-Plattform; der Snapshot bleibt unverändert.
function withAbsoluteAssets(entry: MagazineEntry): MagazineEntry {
  return {
    ...entry,
    canonical: withTrailingSlash(entry.canonical),
    featuredImage: entry.featuredImage ? staticAsset(entry.featuredImage) : entry.featuredImage,
    contentHtml: absolutizeAssetUrls(slashInternalLinks(entry.contentHtml)),
  };
}

// Seitentitel unter ca. 580 px (Google-Abschnitt), gemessen wie Seobility mit 20px Arial; zu kurze mit Nutzen ergänzt.
const SEO_TITLES: Record<string, string> = {
  "spaetes-coming-out-frauen": "Spätes Coming-out: Wenn Frauen neu lieben",
  "lesben-erkennen": "Lesben erkennen: Diese Zeichen deuten darauf hin",
  "offene-beziehungen-frauen": "Offene Beziehungen unter Frauen: Freiheit & Regeln",
  "perfekte-profilbild": "Das perfekte Profilbild für lesbische Dating-Apps",
  "vaginale-selbsttests-dating": "Vaginale Selbsttests und Dating: offen darüber reden",
  "deepfake-gewalt-dating": "Deepfake-Gewalt: So schützen sich Frauen beim Dating",
  "kinderwunsch-social-media-samenspende": "Kinderwunsch über Social Media: Risiken für Lesben",
  "lesben-staedte-szene": "Lesben-Städteguide: Szene in DE, AT und CH",
  "coming-out-day": "Coming Out Day: Feiertag für Selbstliebe & Akzeptanz",
  "lesben-massage": "Lesben Massage: 6 Tipps für deine Freundin",
  "swag-lesbenparty-mai-2017": "S.W.A.G – Lesbenparty im Rhein-Main-Gebiet",
  "tag-der-bisexualitaet": "Bisexual Visibility Day: Tag der Bisexualität",
  redaktion: "Unsere Redaktion: Wer bei Sie sucht Sie schreibt",
  glossar: "Lesben-Glossar: Begriffe von A bis Z",
  alicia: "Alicia Schlienz: Dating-Expertin für LGBT-Themen",
  "zwei-muetter-na-und": "Zwei Mütter! Na und? Leben in einer Regenbogenfamilie",
  // Semrush „identische H1- und Title-Tags“: Titel, die für den Marken-Zusatz zu lang sind, eigens formuliert.
  "8-gruende-warum-frauen-die-besseren-liebhaber-sind": "Frauen als Liebhaberinnen: 8 Gründe, warum sie besser sind",
  androgyn: "Androgyn: Bedeutung, Merkmale & androgyner Körperbau",
  "bin-ich-lesbisch": "Bin ich lesbisch? Anzeichen, Selbsttest & Antworten",
  "buchvorstellung-popcorn-love-das-glueck-ist-so-nah": "„Popcorn Love – Das Glück ist so nah“: Buchvorstellung",
  "coming-out": "Coming-out erleichtern: Tipps für Deinen Weg",
  csd: "CSD – Christopher Street Day: proud to be together",
  demisexualitaet: "Demisexuell: Definition & Bedeutung der Demisexualität",
  "die-ex-zurueckgewinnen": "Die Ex zurückgewinnen: Fünf Strategien, die helfen",
  "go-holidate-reiseideen-fuer-lesbische-frauen": "Reiseideen für lesbische Frauen: GO HOLIDATE",
  "homophobe-menschen-sind-oft-selbst-homosexuell": "Homophobie: Sind Homophobe oft selbst homosexuell?",
  intersexuell: "Intersexualität: Bedeutung, Ursachen und Merkmale",
  "keanu-pioch-unterstuetzung": "Keanu Pioch: Junger Filmemacher braucht Unterstützung",
  "lesben-sex": "Lesben Sex: Stellungen, Vorurteile und Tipps",
  lesbenflagge: "Lesbenflagge: Farben, Bedeutung & Regenbogenfahne",
  "lesbenleben-in-aegypten": "Lesbisch in Ägypten: Leben zwischen Tabus und Tapferkeit",
  lesbentreff: "Lesbentreff: Tipps, wie Du Lesben kennenlernst",
  "lesbian-day": "International Lesbian Day: Ein Tag zum Feiern",
  "lesbian-visibility-day": "Lesbian Visibility Day: Mehr Sichtbarkeit im Alltag",
  lesbisch: "Lesbisch: Bedeutung, Lesbenliebe & kultureller Hintergrund",
  lgbt: "LGBT: Bedeutung von lesbisch, schwul, bi und trans",
  "love-story-sarah-findet-traumfrau-ueber-sie-sucht-sie": "Love-Story: Wie Sarah bei Sie sucht Sie ihre Traumfrau fand",
  "maskulin-feminin": "Maskulin, feminin, neutrum: Bedeutung der Begriffe",
  "outing-und-coming-out-was-ist-hinterher-versteckt": "Outing vs. Coming-out: Das sind die Unterschiede",
  pansexualitaet: "Pansexualität: Definition, Bedeutung & Pride-Flagge",
  pinkcupid: "Pink Cupid: Die Singlebörse für lesbische Frauen",
  "scissoring-sexstellung": "Scissoring: So geht die Lesben-Sexstellung",
  "sie-sucht-sie-ueber-50": "Lesben ab 50: Partnersuche und Singlebörse für Frauen",
  sookee: "Sookee: Künstlerin aus der Queerszene",
  venus7: "Venus7.de: Plattform für Bi-Frauen, Paare und Lesben",
  "temptation-island-vip-2026-erstes-queeres-paar": "Temptation Island VIP 2026: Erstes queeres Paar",
};

// Sonst trägt der Seitentitel die Marke, damit er sich von der H1 (Artikeltitel) unterscheidet.
const BRAND_SUFFIX = " | Sie sucht Sie";
const MAX_TITLE_LENGTH = 60;

export function magazineSeoTitle(entry: Pick<MagazineEntry, "slug" | "title">) {
  const custom = SEO_TITLES[entry.slug];
  if (custom) return custom;
  const branded = `${entry.title}${BRAND_SUFFIX}`;
  return branded.length <= MAX_TITLE_LENGTH && !/sie sucht sie/i.test(entry.title) ? branded : undefined;
}

function withSeoTitle(entry: MagazineEntry): MagazineEntry {
  const seoTitle = magazineSeoTitle(entry);
  return seoTitle ? { ...entry, seoTitle } : entry;
}

// Zu kurze H1 (Seobility, unter ca. 20 Zeichen); Titel, Karten und Linktexte behalten den Originaltitel.
const H1_OVERRIDES: Record<string, string> = {
  glossar: "Glossar: Begriffe von A bis Z",
  alicia: "Alicia Schlienz – Autorin im Magazin",
  redaktion: "Unsere Redaktion bei Sie-sucht-Sie",
};
export function magazineHeading(entry: Pick<MagazineEntry, "slug" | "title">) {
  return H1_OVERRIDES[entry.slug] ?? entry.title;
}

export const magazineEntries = (catalog.entries as MagazineEntry[]).map((entry) => ({ ...entry, contentHtml: withUniqueEntryLinks(entry.slug, entry.contentHtml) })).map((entry) => applyTextCorrections(entry, MAGAZINE_CORRECTIONS) as MagazineEntry).map(withCategoryCorrections).map(withSeoTitle).map(withAbsoluteAssets).map((entry) => withImageAlts(entry, entry.title) as MagazineEntry)
  // Seobility: leere Überschriften, zu viele/leere/doppelte Strong-Tags, Tippfehler; Semrush: zu lange Absätze.
  .map((entry) => ({ ...entry, contentHtml: splitLongParagraphs(fixTypos(limitStrong(withoutEmptyHeadings(entry.contentHtml)))) }));
export const magazineAttachments = (catalog.attachments as MagazineAttachment[]).map((attachment) =>
  attachment.targetType === "asset"
    ? { ...attachment, target: staticAsset(attachment.target) }
    : { ...attachment, target: withTrailingSlash(attachment.target) },
);
/** Unmigrated WordPress URLs (member contact ads, tag listings) that permanently redirect. */
export const magazineRetiredPaths = (catalog.retired as MagazineRetiredPath[]).map((retired) => ({ ...retired, target: withTrailingSlash(retired.target) }));
export const magazinePosts = magazineEntries
  .filter((entry) => entry.type === "post")
  .sort((a, b) => b.date.localeCompare(a.date));
export const magazinePages = magazineEntries
  .filter((entry) => entry.type === "page")
  .sort((a, b) => a.title.localeCompare(b.title, "de"));
export const magazineAuthors = catalog.authors as MagazineAuthor[];
export const magazineTags = catalog.tags as MagazineCategory[];
/** IDs der ehemaligen WordPress-Inhalte (ohne das Lexikon); nur diese gibt der WP-REST-Endpunkt aus. */
export const magazineWordpressIds = new Set(catalog.entries.map((entry) => entry.id));

/** Visible article date: the last update, falling back to the publication date. Pages show no date. */
export function articleUpdatedDate(entry: MagazineEntry): string {
  return entry.modified || entry.date;
}

const magazineAssets = catalog.assets as MagazineAsset[];
const entryByPath = new Map(magazineEntries.map((entry) => [entry.path, entry]));
const attachmentByPath = new Map(magazineAttachments.map((attachment) => [attachment.path, attachment]));
const retiredByPath = new Map(magazineRetiredPaths.map((retired) => [retired.path, retired]));
const categoryBySlug = new Map(magazineCategories.map((category) => [category.slug, category]));
const authorBySlug = new Map(magazineAuthors.map((author) => [author.slug, author]));
const legacyAssetByPath = new Map(
  magazineAssets.flatMap((asset) => asset.legacyPaths.map((path) => [safeDecodePath(path), staticAsset(asset.localPath)] as const)),
);

export function getMagazineEntry(path: string) {
  return entryByPath.get(normalizeMagazinePath(path));
}

export function getMagazineAttachment(path: string) {
  return attachmentByPath.get(normalizeMagazinePath(path));
}

export function getRetiredMagazinePath(path: string) {
  return retiredByPath.get(normalizeMagazinePath(path));
}

export function getMagazineCategory(slug: string) {
  return categoryBySlug.get(slug);
}

export function getMagazineAuthor(slug: string) {
  return authorBySlug.get(slug);
}

export function postsForMagazineCategory(id: number) {
  return magazinePosts.filter((entry) => entry.categories.some((category) => category.id === id));
}

/** Posts grouped by publication year, newest year first (posts stay newest first). */
export function magazinePostsByYear() {
  const years = new Map<string, MagazineEntry[]>();
  for (const entry of magazinePosts) {
    const year = entry.date.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), entry]);
  }
  return [...years].map(([year, posts]) => ({ year, posts }));
}

export function postsForMagazineAuthor(id: number) {
  return magazinePosts.filter((entry) => entry.author?.id === id);
}

export function getLegacyMagazineAsset(path: string) {
  return legacyAssetByPath.get(safeDecodePath(normalizeMagazinePath(path)));
}

export function normalizeMagazinePath(path: string) {
  const clean = path.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return clean || "/";
}

function safeDecodePath(path: string) {
  try {
    return decodeURI(path);
  } catch {
    return "";
  }
}

export function magazineStaticParams() {
  return [
    ...magazineEntries.map((entry) => entry.path),
    ...magazineAttachments.map((entry) => entry.path),
    ...magazineRetiredPaths.map((entry) => entry.path),
  ]
    .map((path) => ({ slug: path.replace(/^\/magazin\//, "").split("/").map(decodeURIComponent) }));
}

export function relatedMagazineEntries(entry: MagazineEntry, limit = 3) {
  const categorySlugs = new Set(entry.categories.map((category) => category.slug));
  return magazinePosts
    .filter((candidate) => candidate.id !== entry.id)
    .sort((a, b) => {
      const aScore = a.categories.filter((category) => categorySlugs.has(category.slug)).length;
      const bScore = b.categories.filter((category) => categorySlugs.has(category.slug)).length;
      return bScore - aScore || b.date.localeCompare(a.date);
    })
    .slice(0, limit);
}

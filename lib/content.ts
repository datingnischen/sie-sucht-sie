import catalog from "@/data/pages.json";
import { classifyPath, publicUrl, SITE_URL, slashInternalLinks, withTrailingSlash } from "./site-contract.mjs";
import { ABOUT_PAGE_MOVES, aboutPathForImportedPath } from "./about-pages.mjs";
import { absolutizeAssetUrls, staticAsset } from "./static-asset.mjs";
import { applyTextCorrections, PAGE_CORRECTIONS } from "./text-corrections.mjs";
import { withCityPhoto } from "./city-photos.mjs";
import { withImageAlts } from "./image-alt.mjs";
import { fixTypos, limitStrong, withoutEmptyHeadings, withoutH1Repeat } from "./html-cleanup.mjs";
import { withUniquePageLinks } from "./link-targets.mjs";

export type ImportedPage = {
  path: string;
  sourceUrl: string;
  canonical: string;
  type: "location" | "lexicon" | "editorial" | "magazine" | "platform";
  title: string;
  description: string;
  /** Nur für <title>/Meta-Description, wenn sie vom sichtbaren Seitentext abweichen sollen. */
  seoTitle?: string;
  seoDescription?: string;
  h1: string;
  contentHtml: string;
  images: Array<{ src: string; alt: string }>;
  widgetUrl: string | null;
  sourceStatus: number;
};

// Pages that ICONY still serves on the live domain are never rendered here,
// and imported links to them point straight to the live domain.
const ICONY_PAGE_LINK = /href="(\/(?:(?:sicherheit-und-datenschutz|redaktionelle-kontrolle|kostenlose-basis-mitgliedschaft|premium-mitgliedschaft|unsere-erfolgsgeschichten|fragenflirt|fotoflirt|videodating)\.html|dating-tipps\/?))"/g;
// Imported links to pages that moved below "Über uns" point to their new path.
const ABOUT_PAGE_LINK = new RegExp(`href="(${Object.keys(ABOUT_PAGE_MOVES).join("|")})/?"`, "g");

function withPlatformOwnership(page: ImportedPage): ImportedPage {
  const contentHtml = page.contentHtml
    .replace(ICONY_PAGE_LINK, `href="${SITE_URL}$1"`)
    .replace(ABOUT_PAGE_LINK, (_, path: string) => `href="${aboutPathForImportedPath(path)}"`);
  return { ...page, contentHtml, type: classifyPath(page.path) === "platform" ? "platform" : page.type };
}

function withAboutPath(page: ImportedPage): ImportedPage {
  const path = aboutPathForImportedPath(page.path);
  return path === page.path ? page : { ...page, path, canonical: publicUrl(path) };
}

// Seitentitel unter ca. 580 px und eigene Metadaten, gemessen wie Seobility (20px Arial). Nur <title>/Description,
// die sichtbare Überschrift bleibt. ICONY bedient /bewertungen-und-erfahrungen/ und /social-media/ weiter mit
// denselben Texten, darum eigene Metadaten für die Über-uns-Kopien.
const SEO_OVERRIDES: Record<string, Pick<ImportedPage, "seoTitle" | "seoDescription">> = {
  "/ueber-uns/bewertungen": {
    seoTitle: "Bewertungen & Erfahrungen mit Sie sucht Sie",
    seoDescription: "Was Mitglieder über Sie sucht Sie sagen: Erfahrungen, Trustpilot-Bewertungen und Vergleiche zur Partnersuche für lesbische Frauen.",
  },
  "/ueber-uns/social-media": {
    seoTitle: "Sie sucht Sie auf Instagram, Facebook & YouTube",
    seoDescription: "Sie sucht Sie auf Instagram, Facebook und YouTube: Liebesgeschichten, Community-Themen und Neuigkeiten. Folge unseren offiziellen Kanälen.",
  },
  "/partnersuche/koeln": { seoTitle: "Sie sucht Sie in Köln – Lesbische Frauen treffen" },
  "/partnersuche/mainz": { seoTitle: "Sie sucht Sie in Mainz – Lesbische Frauen treffen" },
  // Title und H1 waren identisch (Semrush).
  "/schweiz": { seoTitle: "Lesbische Singles in der Schweiz: Tipps & Partnersuche" },
};

function withSeoOverrides(page: ImportedPage): ImportedPage {
  const override = SEO_OVERRIDES[page.path];
  if (override) return { ...page, ...override };
  // Österreich-Seiten heißen nur „Lesbisch in Wien“: zu kurz für den Titel, mit Nutzen ergänzt.
  if (page.type === "location" && /^\/oesterreich\/[^/]+$/.test(page.path) && /^Lesbisch in [^:–-]+$/.test(page.title)) {
    return { ...page, seoTitle: `${page.title}: Frauen kennenlernen` };
  }
  return page;
}

// Seiten-URLs enden auf "/" wie die ICONY-Plattform; der Import-Snapshot bleibt unverändert.
function withTrailingSlashUrls(page: ImportedPage): ImportedPage {
  return { ...page, canonical: withTrailingSlash(page.canonical), contentHtml: slashInternalLinks(page.contentHtml) };
}

// Importierte Medien liegen in public/magazine/media und kommen vom Asset-Host (nginx reicht nur Seitenrouten durch).
function withAbsoluteAssets(page: ImportedPage): ImportedPage {
  return {
    ...page,
    contentHtml: absolutizeAssetUrls(page.contentHtml),
    images: page.images.map((image) => ({ ...image, src: staticAsset(image.src) })),
  };
}

const pages = (catalog.pages as ImportedPage[]).map((page) => ({ ...page, contentHtml: withUniquePageLinks(page.path, page.contentHtml) })).map((page) => applyTextCorrections(page, PAGE_CORRECTIONS) as ImportedPage).map(withPlatformOwnership).map(withAboutPath).map(withSeoOverrides).map(withTrailingSlashUrls).map(withAbsoluteAssets).map((page) => withCityPhoto(page, staticAsset) as ImportedPage).map((page) => withImageAlts(page, page.h1 || page.title) as ImportedPage)
  // Seobility: leere Überschriften, H1-Wiederholung im Text, zu viele/leere/doppelte Strong-Tags, Tippfehler.
  .map((page) => ({ ...page, contentHtml: fixTypos(limitStrong(withoutH1Repeat(withoutEmptyHeadings(page.contentHtml), page.h1))), description: fixTypos(page.description) }));
const pageMap = new Map(pages.map((page) => [page.path, page]));

export const publicPages = pages.filter((page) => page.type !== "platform" && page.type !== "magazine");

export function normalizePublicPath(parts?: string[]) {
  return !parts?.length ? "/" : `/${parts.join("/")}`;
}

export function getImportedPage(path: string) {
  return pageMap.get(path) ?? null;
}

export function getFamilyPages(root: "partnersuche" | "oesterreich" | "schweiz" | "lexikon") {
  const prefix = `/${root}/`;
  return publicPages.filter((page) => page.path.startsWith(prefix));
}

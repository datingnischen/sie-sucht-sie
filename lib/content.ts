import catalog from "@/data/pages.json";
import { classifyPath, publicUrl, SITE_URL, slashInternalLinks, withTrailingSlash } from "./site-contract.mjs";
import { ABOUT_PAGE_MOVES, aboutPathForImportedPath } from "./about-pages.mjs";
import { absolutizeAssetUrls, staticAsset } from "./static-asset.mjs";

export type ImportedPage = {
  path: string;
  sourceUrl: string;
  canonical: string;
  type: "location" | "lexicon" | "editorial" | "magazine" | "platform";
  title: string;
  description: string;
  h1: string;
  contentHtml: string;
  images: Array<{ src: string; alt: string }>;
  widgetUrl: string | null;
  sourceStatus: number;
};

// Pages that ICONY still serves on the live domain are never rendered here,
// and imported links to them point straight to the live domain.
const ICONY_PAGE_LINK = /href="(\/(?:(?:sicherheit-und-datenschutz|redaktionelle-kontrolle|kostenlose-basis-mitgliedschaft|unsere-erfolgsgeschichten)\.html|dating-tipps\/?))"/g;
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

const pages = (catalog.pages as ImportedPage[]).map(withPlatformOwnership).map(withAboutPath).map(withTrailingSlashUrls).map(withAbsoluteAssets);
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

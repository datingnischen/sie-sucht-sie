import catalog from "@/data/pages.json";
import { classifyPath, SITE_URL } from "./site-contract.mjs";

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
const ICONY_PAGE_LINK = /href="(\/(?:sicherheit-und-datenschutz|redaktionelle-kontrolle|kostenlose-basis-mitgliedschaft|unsere-erfolgsgeschichten)\.html)"/g;

function withPlatformOwnership(page: ImportedPage): ImportedPage {
  const contentHtml = page.contentHtml.replace(ICONY_PAGE_LINK, `href="${SITE_URL}$1"`);
  return { ...page, contentHtml, type: classifyPath(page.path) === "platform" ? "platform" : page.type };
}

const pages = (catalog.pages as ImportedPage[]).map(withPlatformOwnership);
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

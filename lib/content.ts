import catalog from "@/data/pages.json";

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

const pages = catalog.pages as ImportedPage[];
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

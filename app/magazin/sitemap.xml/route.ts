import { magazineCategories, magazineEntries } from "@/lib/magazine";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function GET() {
  // Kategorien mit eigenem Hub-Text sind indexierbar und gehören deshalb in die Sitemap; reine Beitragslisten nicht.
  const hubs = magazineCategories.filter((category) => category.description).map((category) => `https://www.sie-sucht-sie.de/magazin/kategorie/${category.slug}/`);
  const urls = ["https://www.sie-sucht-sie.de/magazin/", "https://www.sie-sucht-sie.de/magazin/archiv/", ...hubs, ...magazineEntries.map((entry) => entry.canonical)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}

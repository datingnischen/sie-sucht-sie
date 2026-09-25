import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ABOUT_SOCIAL_PATH } from "@/lib/about-pages.mjs";
import { getFamilyPages, getImportedPage, normalizePublicPath, publicPages } from "@/lib/content";
import { removeHeroImageFromContent, selectHeroImage } from "@/lib/hero-image.mjs";
import { buildFaqMainEntity, extractFaq } from "@/lib/faq.mjs";
import { FaqSection } from "@/components/faq-section";
import { registrationUrl } from "@/lib/site";
import { CityCardSection } from "@/components/city-card-section";
import { removeLegacyCityLists } from "@/lib/location-hub.mjs";
import { buildBreadcrumbs, buildBreadcrumbSchema } from "@/lib/breadcrumbs.mjs";
import { buildRelatedCards } from "@/lib/related-cards.mjs";
import { RelatedCardSection } from "@/components/related-card-section";
import { buildPageEntityGraph, serializePageEntityGraph } from "@/lib/page-entities.mjs";
import { getCitySearchUrl } from "@/lib/location-search.mjs";
import { staticAsset } from "@/lib/static-asset.mjs";

type Props = { params: Promise<{ slug: string[] }> };

// Paths with their own route under app/ instead of the imported-page template.
const dedicatedRoutes = new Set([ABOUT_SOCIAL_PATH]);

export function generateStaticParams() {
  return publicPages.filter((page) => page.path !== "/" && !dedicatedRoutes.has(page.path)).map((page) => ({ slug: page.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getImportedPage(normalizePublicPath(slug));
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: page.canonical }, openGraph: { title: page.title, description: page.description, url: page.canonical, images: selectHeroImage(page.images)?.src ? [selectHeroImage(page.images).src] : undefined } };
}

export default async function ImportedPageView({ params }: Props) {
  const { slug } = await params;
  const path = normalizePublicPath(slug);
  const page = getImportedPage(path);
  if (!page || page.type === "platform" || page.type === "magazine") notFound();
  const root = path.split("/")[1] as "partnersuche" | "oesterreich" | "schweiz" | "lexikon";
  const image = selectHeroImage(page.images);
  const locationHubRoot = ["partnersuche", "oesterreich", "schweiz"].includes(root) && path === `/${root}` ? root as "partnersuche" | "oesterreich" | "schweiz" : null;
  const related = !locationHubRoot && ["partnersuche", "oesterreich", "schweiz", "lexikon"].includes(root) ? getFamilyPages(root).filter((item) => item.path !== path).slice(0, 6) : [];
  const relatedCards = page.type === "location" && !locationHubRoot ? buildRelatedCards(publicPages, path, root) : [];
  const contentHtml = removeHeroImageFromContent(locationHubRoot ? removeLegacyCityLists(page.contentHtml, locationHubRoot, page.h1) : page.contentHtml, image);
  const faq = extractFaq(contentHtml);
  const breadcrumbName = page.type === "location" ? undefined : page.h1;
  const breadcrumbs = buildBreadcrumbs(path, breadcrumbName);
  const breadcrumbSchema = buildBreadcrumbSchema(path, breadcrumbName);
  const pageEntityGraph = buildPageEntityGraph(page, { faqEntities: faq ? buildFaqMainEntity(faq.groups) : [], breadcrumb: breadcrumbSchema });
  const citySearchUrl = page.type === "location" && !locationHubRoot ? getCitySearchUrl(path) : null;
  return <main className="wrap page-shell">
    <article className="article-card">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{breadcrumbs.map((item, index) => <li key={item.path}>{index < breadcrumbs.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializePageEntityGraph(pageEntityGraph) }} />
      <div className="article-hero"><div><p className="kicker">{page.type === "location" ? "Regional kennenlernen" : page.type === "lexicon" ? "Kurz erklärt" : "Gut informiert"}</p><h1>{page.h1}</h1><p className="lead">{page.description}</p><a className="button button-green" href={registrationUrl(path)}>Jetzt kostenlos starten</a></div>{image ? <img src={image.src} alt={image.alt || page.h1} /> : null}</div>
      {locationHubRoot ? <CityCardSection pages={publicPages} root={locationHubRoot} /> : null}
      {faq ? <>
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: faq.beforeHtml }} />
        <FaqSection groups={faq.groups} registrationHref={registrationUrl(path)} />
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: faq.afterHtml }} />
      </> : <div className="rich-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />}
      {citySearchUrl ? <aside className="inline-cta location-search-cta"><h2>Frauen in Deiner Stadt entdecken</h2><p>Starte die öffentliche Suche mit der zentralen Postleitzahl Deiner Stadt.</p><a className="button button-pink" href={citySearchUrl}>Frauen in meiner Stadt finden</a></aside> : null}
      <aside className="inline-cta inline-cta-radar"><div><h2>Bereit für Deinen ersten Kontakt?</h2><p>Erstelle kostenlos Dein Profil und entdecke Frauen, die ähnliche Wünsche und Werte mitbringen.</p><a className="button button-green" href={registrationUrl(path)}>Kostenlos registrieren</a></div><a className="radar-card" href={registrationUrl(path)}><img src={staticAsset("/brand/umkreissuche-radar.svg")} alt="Umkreissuche: Frauen in Deiner Nähe – kostenlos anmelden" width={320} height={480} loading="lazy" decoding="async" /></a></aside>
    </article>
    {relatedCards.length ? <RelatedCardSection cards={relatedCards} /> : related.length ? <aside className="related"><p className="kicker">Weiter entdecken</p><h2>Weitere passende Einstiege</h2><div className="related-grid">{related.map((item) => <Link href={item.path} key={item.path}><strong>{item.h1}</strong><span>Mehr erfahren →</span></Link>)}</div></aside> : null}
  </main>;
}

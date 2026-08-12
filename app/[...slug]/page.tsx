import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFamilyPages, getImportedPage, normalizePublicPath, publicPages } from "@/lib/content";
import { selectHeroImage } from "@/lib/hero-image.mjs";
import { registrationUrl } from "@/lib/site";
import { CityCardSection } from "@/components/city-card-section";
import { removeLegacyCityLists } from "@/lib/location-hub.mjs";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return publicPages.filter((page) => page.path !== "/").map((page) => ({ slug: page.path.slice(1).split("/") }));
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
  const isGermanLocationHub = path === "/partnersuche";
  const related = !isGermanLocationHub && ["partnersuche", "oesterreich", "schweiz", "lexikon"].includes(root) ? getFamilyPages(root).filter((item) => item.path !== path).slice(0, 6) : [];
  const contentHtml = isGermanLocationHub ? removeLegacyCityLists(page.contentHtml) : page.contentHtml;
  return <main className="wrap page-shell">
    <article className="article-card">
      <p className="breadcrumbs"><Link href="/">Start</Link> <span>/</span> {path.split("/").filter(Boolean).map((part) => part.replaceAll("-", " ")).join(" / ")}</p>
      <div className="article-hero"><div><p className="kicker">{page.type === "location" ? "Regional kennenlernen" : page.type === "lexicon" ? "Kurz erklärt" : "Gut informiert"}</p><h1>{page.h1}</h1><p className="lead">{page.description}</p><a className="button button-green" href={registrationUrl(path)}>Jetzt kostenlos starten</a></div>{image ? <img src={image.src} alt={image.alt || page.h1} /> : null}</div>
      {isGermanLocationHub ? <CityCardSection pages={publicPages} /> : null}
      <div className="rich-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <aside className="inline-cta"><h2>Bereit für Deinen ersten Kontakt?</h2><p>Erstelle kostenlos Dein Profil und entdecke Frauen, die ähnliche Wünsche und Werte mitbringen.</p><a className="button button-green" href={registrationUrl(path)}>Kostenlos registrieren</a></aside>
    </article>
    {related.length ? <aside className="related"><p className="kicker">Weiter entdecken</p><h2>Weitere passende Einstiege</h2><div className="related-grid">{related.map((item) => <Link href={item.path} key={item.path}><strong>{item.h1}</strong><span>Mehr erfahren →</span></Link>)}</div></aside> : null}
  </main>;
}

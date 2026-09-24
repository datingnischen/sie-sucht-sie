import type { Metadata } from "next";
import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine-breadcrumbs";
import { articleUpdatedDate, magazineCategories, magazinePages, magazinePosts, postsForMagazineCategory } from "@/lib/magazine";

export const metadata: Metadata = {
  title: "Magazin für lesbische und bisexuelle Frauen – Dating, Liebe & Szene",
  description: "Artikel über lesbisches Dating, Beziehungen, Coming-out, Szene-Treffpunkte und das Leben als Frau, die Frauen liebt.",
  alternates: { canonical: "https://www.sie-sucht-sie.de/magazin" },
  openGraph: {
    type: "website",
    url: "https://www.sie-sucht-sie.de/magazin",
    title: "Das Sie-sucht-Sie Magazin",
    description: "Artikel über lesbisches Dating, Beziehungen, Coming-out und Szene-Treffpunkte.",
  },
};

// Landing shows the newest posts only; everything else lives in /magazin/archiv.
const LANDING_POST_COUNT = 15;

// Author bio pages are linked from bylines; they are not listed as guides.
const BIO_PAGE_SLUGS = new Set(["alicia", "christian-m-haas", "redaktion"]);

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}

export default function MagazinePage() {
  const featured = magazinePosts.slice(0, 3);
  const morePosts = magazinePosts.slice(3, LANDING_POST_COUNT);
  const olderCount = magazinePosts.length - LANDING_POST_COUNT;
  const guides = magazinePages.filter((entry) => !BIO_PAGE_SLUGS.has(entry.slug));
  const categories = magazineCategories.filter((category) => postsForMagazineCategory(category.id).length > 0);
  return (
    <main className="magazine-main">
      <section className="magazine-hero">
        <div className="wrap magazine-hero-inner">
          <p className="kicker">Sie-sucht-Sie Magazin</p>
          <h1>Dating, Liebe und lesbisches Leben</h1>
          <p>Hier geht es um Dates mit Frauen, Beziehungen, Coming-out und die Szene in Deiner Stadt.</p>
        </div>
      </section>

      <div className="wrap magazine-breadcrumb-row"><MagazineBreadcrumbs /></div>

      <section className="wrap magazine-section" aria-labelledby="aktuell">
        <div className="magazine-heading"><div><p className="kicker">Neu im Magazin</p><h2 id="aktuell">Aktuelle Beiträge</h2></div><p>Neue Artikel über lesbisches Dating, Beziehungen und Coming-out.</p></div>
        <div className="magazine-feature-grid">
          {featured.map((entry, index) => (
            <article className={`magazine-feature-card ${index === 0 ? "magazine-feature-lead" : ""}`} key={entry.id}>
              <Link href={entry.path} aria-label={`${entry.title} lesen`}>
                <MagazineImage entry={entry} />
                <div className="magazine-card-copy">
                  <span>{entry.categories[0]?.name || "Magazin"}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <time dateTime={articleUpdatedDate(entry)}>Aktualisiert {dateLabel(articleUpdatedDate(entry))}</time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <nav className="wrap magazine-category-nav" aria-label="Magazin-Kategorien">
          <Link className="magazine-category-all" href="/magazin/archiv">Alle Artikel</Link>
          {categories.map((category) => <Link href={`/magazin/kategorie/${category.slug}`} key={category.id}>{category.name}</Link>)}
        </nav>
      )}

      <section className="wrap magazine-section" aria-labelledby="alle-beitraege">
        <div className="magazine-heading"><div><p className="kicker">Weiterlesen</p><h2 id="alle-beitraege">Weitere Beiträge</h2></div><p>Lies über Partnersuche, Coming-out, Sex, Beziehungen, Serien und lesbische Kultur.</p></div>
        <div className="magazine-card-grid">
          {morePosts.map((entry) => (
            <article className="magazine-card" key={entry.id}>
              <Link href={entry.path}>
                <MagazineImage entry={entry} />
                <div className="magazine-card-copy">
                  <span>{entry.categories[0]?.name || "Ratgeber"}</span>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <time dateTime={articleUpdatedDate(entry)}>Aktualisiert {dateLabel(articleUpdatedDate(entry))}</time>
                </div>
              </Link>
            </article>
          ))}
        </div>
        {olderCount > 0 && (
          <div className="magazine-archive-cta">
            <div>
              <p className="kicker">Inhaltsverzeichnis</p>
              <h3>Noch {olderCount} ältere Artikel</h3>
              <p>Alle {magazinePosts.length} Beiträge nach Jahren sortiert, mit Themenübersicht.</p>
            </div>
            <Link className="button button-pink" href="/magazin/archiv">Alle Artikel ansehen →</Link>
          </div>
        )}
      </section>

      <section className="wrap magazine-section magazine-guides" aria-labelledby="guides">
        <div className="magazine-heading"><div><p className="kicker">Schnell gefunden</p><h2 id="guides">Szenebars, Begriffe und mehr</h2></div><p>Finde lesbische Bars und Clubs in Deiner Stadt und lies Begriffe aus Dating und Community nach.</p></div>
        <div className="magazine-guide-grid">
          {guides.map((entry) => <Link href={entry.path} key={entry.id}><strong>{entry.title}</strong><span>Guide öffnen →</span></Link>)}
        </div>
      </section>
    </main>
  );
}

function MagazineImage({ entry }: { entry: (typeof magazinePosts)[number] }) {
  return entry.featuredImage
    ? <span className="magazine-card-media"><img src={entry.featuredImage} alt="" loading="lazy" /></span>
    : <span className="magazine-card-media magazine-card-fallback" aria-hidden="true" />;
}

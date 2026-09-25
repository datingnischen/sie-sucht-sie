import type { Metadata } from "next";
import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine-breadcrumbs";
import { articleUpdatedDate, magazineCategories, magazinePostsByYear, magazinePosts, postsForMagazineCategory } from "@/lib/magazine";

export const metadata: Metadata = {
  title: "Alle Artikel im Magazin – Inhaltsverzeichnis",
  description: "Alle Artikel aus dem Sie-sucht-Sie Magazin nach Jahren sortiert: lesbisches Dating, Beziehungen, Coming-out, Serien und Szene.",
  alternates: { canonical: "https://www.sie-sucht-sie.de/magazin/archiv/" },
};

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function MagazineArchivePage() {
  const years = magazinePostsByYear();
  const categories = magazineCategories
    .map((category) => ({ ...category, total: postsForMagazineCategory(category.id).length }))
    .filter((category) => category.total > 0);
  const firstYear = years.at(-1)?.year;
  return (
    <main className="magazine-main">
      <section className="magazine-archive-hero magazine-toc-hero">
        <div className="wrap">
          <MagazineBreadcrumbs current="Alle Artikel" />
          <p className="kicker">Inhaltsverzeichnis</p>
          <h1>Alle Artikel im Magazin</h1>
          <p>Alle Beiträge auf einen Blick, die neuesten zuerst. Spring direkt zu einem Jahrgang oder stöbere nach Thema.</p>
          <dl className="magazine-toc-stats">
            <div><dt>Artikel</dt><dd>{magazinePosts.length}</dd></div>
            <div><dt>Jahrgänge</dt><dd>{years.length}</dd></div>
            <div><dt>Themen</dt><dd>{categories.length}</dd></div>
            {firstYear && <div><dt>Seit</dt><dd>{firstYear}</dd></div>}
          </dl>
        </div>
      </section>

      <nav className="magazine-toc-jump" aria-label="Zu Jahrgang springen">
        <div className="wrap">
          <span>Jahr</span>
          {years.map(({ year, posts }) => <a href={`#jahr-${year}`} key={year}>{year}<small>{posts.length}</small></a>)}
        </div>
      </nav>

      <div className="wrap magazine-toc-layout">
        <div className="magazine-toc-years">
          {years.map(({ year, posts }) => (
            <section className="magazine-toc-year" id={`jahr-${year}`} aria-labelledby={`jahr-${year}-titel`} key={year}>
              <header>
                <h2 id={`jahr-${year}-titel`}>{year}</h2>
                <p>{posts.length} Artikel</p>
              </header>
              <ol>
                {posts.map((entry) => (
                  <li key={entry.id}>
                    <Link className="magazine-toc-row" href={entry.path}>
                      {entry.featuredImage
                        ? <img src={entry.featuredImage} alt="" loading="lazy" />
                        : <span className="magazine-toc-thumb" aria-hidden="true" />}
                      <span className="magazine-toc-copy">
                        <strong>{entry.title}</strong>
                        <span>{entry.categories[0]?.name || "Magazin"}</span>
                      </span>
                      <time dateTime={articleUpdatedDate(entry)}>Aktualisiert {dayLabel(articleUpdatedDate(entry))}</time>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <aside className="magazine-toc-side" aria-labelledby="themen">
          <h2 id="themen">Nach Thema</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}><Link href={`/magazin/kategorie/${category.slug}`}><span>{category.name}</span><small>{category.total}</small></Link></li>
            ))}
          </ul>
          <Link className="button button-outline" href="/magazin">Zur Magazin-Startseite</Link>
        </aside>
      </div>
    </main>
  );
}

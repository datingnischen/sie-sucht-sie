import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbs } from "@/lib/breadcrumbs.mjs";
import { publicUrl } from "@/lib/site-contract.mjs";
import { cleanQuery, searchDocuments, SITE_SEARCH_MAX_RESULTS, SITE_SEARCH_PATH } from "@/lib/site-search.mjs";
import { siteSearchDocuments } from "@/lib/site-search-index";
import { SiteSearchForm } from "@/components/site-search-form";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

const canonical = publicUrl(SITE_SEARCH_PATH);

// Suchergebnisse sind keine eigenständigen Seiten: noindex, Canonical ohne Query, nicht in der Sitemap.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = cleanQuery((await searchParams).q);
  return {
    title: query ? `Suche: ${query}` : "Suche im Magazin, in Städten und im Lexikon",
    description: "Durchsuche das Magazin, die Städteseiten und das Lexikon von Sie-sucht-Sie.de.",
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default async function SiteSearchPage({ searchParams }: Props) {
  const query = cleanQuery((await searchParams).q);
  const results = query ? searchDocuments(siteSearchDocuments, query, SITE_SEARCH_MAX_RESULTS) : [];
  const breadcrumbs = buildBreadcrumbs(SITE_SEARCH_PATH, "Suche");
  return <main className="wrap page-shell site-search-page">
    <article className="article-card">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{breadcrumbs.map((item, index) => <li key={item.path}>{index < breadcrumbs.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>
      <header className="site-search-hero">
        <p className="kicker">Suche</p>
        <h1>Was suchst Du?</h1>
        <p className="lead">Finde Artikel aus unserem Magazin, Städte- und Regionsseiten sowie Begriffe aus dem Lexikon.</p>
        <SiteSearchForm defaultValue={query} id="site-search-page-q" label="Suchbegriff" autoFocus={!query} />
      </header>

      {!query ? <div className="site-search-empty">
        <h2>Starte mit einem Stichwort</h2>
        <p>Gib zum Beispiel Deine Stadt ein, ein Thema wie „Coming-out“ oder einen Begriff, über den Du mehr wissen möchtest.</p>
      </div> : results.length ? <section aria-labelledby="site-search-results-title">
        <h2 id="site-search-results-title" className="site-search-count">{results.length === 1 ? "1 Treffer" : `${results.length}${results.length >= SITE_SEARCH_MAX_RESULTS ? "+" : ""} Treffer`} für „{query}“</h2>
        <ol className="site-search-results">
          {results.map((result) => <li key={result.href}>
            <Link className="site-search-result" href={result.href}>
              <span className="site-search-section">{result.section}</span>
              <strong>{result.title}</strong>
              {result.excerpt ? <span className="site-search-excerpt">{result.excerpt}</span> : null}
            </Link>
          </li>)}
        </ol>
      </section> : <div className="site-search-empty">
        <h2>Leider nichts gefunden für „{query}“</h2>
        <p>Probier es mit einem anderen oder kürzeren Begriff – oder stöbere direkt im <Link href="/magazin">Magazin</Link>, in der <Link href="/partnersuche">Partnersuche nach Städten</Link> oder im <Link href="/lexikon">Lexikon</Link>.</p>
      </div>}
    </article>
  </main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { buildBreadcrumbs } from "@/lib/breadcrumbs.mjs";
import { publicUrl, withTrailingSlash } from "@/lib/site-contract.mjs";
import { cleanQuery, searchDocuments, SITE_SEARCH_MAX_RESULTS, SITE_SEARCH_PATH } from "@/lib/site-search.mjs";
import { siteSearchDocuments } from "@/lib/site-search-index";
import { AboutHero } from "@/components/about/about-hero";
import { ArrowIcon, BookIcon, MountainIcon, PinIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { SiteSearchForm } from "@/components/site-search-form";
import "@/components/about/site-search.css";

type Props = { searchParams: Promise<{ q?: string | string[]; typ?: string | string[] }> };

const canonical = publicUrl(SITE_SEARCH_PATH);
const searchHref = withTrailingSlash(SITE_SEARCH_PATH);

// Ergebnistypen aus dem Suchindex (lib/site-search-index.ts) mit Symbol und Filter-Schlüssel.
const TYPES: Array<{ section: string; key: string; label: string; icon: ReactNode }> = [
  { section: "Stadt", key: "stadt", label: "Städte", icon: <PinIcon /> },
  { section: "Region", key: "region", label: "Regionen", icon: <MountainIcon /> },
  { section: "Lexikon", key: "lexikon", label: "Lexikon", icon: <BookIcon /> },
  { section: "Magazin", key: "magazin", label: "Magazin", icon: <SparkIcon /> },
];
const typeFor = (section: string) => TYPES.find((type) => type.section === section) || TYPES[3];

const SUGGESTIONS = ["Berlin", "Hamburg", "Wien", "Coming-out", "Regenbogenfahne", "Queer"];

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Markiert die Suchbegriffe im Titel (ohne HTML, nur React-Knoten). */
function highlight(text: string, query: string): ReactNode {
  const terms = query.split(" ").map((term) => term.trim()).filter((term) => term.length > 1);
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return text.split(pattern).map((part, index) => (index % 2 ? <mark key={index}>{part}</mark> : part));
}

const queryHref = (query: string, typ?: string) => `${searchHref}?q=${encodeURIComponent(query)}${typ ? `&typ=${typ}` : ""}`;
const displayPath = (href: string) => `sie-sucht-sie.de${href}`;

export default async function SiteSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = cleanQuery(params.q);
  const typ = cleanQuery(params.typ).toLowerCase();
  const all = query ? searchDocuments(siteSearchDocuments, query, siteSearchDocuments.length) : [];
  const activeType = TYPES.find((type) => type.key === typ);
  const results = (activeType ? all.filter((result) => result.section === activeType.section) : all).slice(0, SITE_SEARCH_MAX_RESULTS);
  const counts = TYPES.map((type) => ({ ...type, count: all.filter((result) => result.section === type.section).length })).filter((type) => type.count);
  const breadcrumbs = buildBreadcrumbs(SITE_SEARCH_PATH, "Suche");
  const total = activeType ? results.length : all.length;

  return <main className="ab-page ss-page">
    <AboutHero
      breadcrumbs={breadcrumbs}
      badge="Suche"
      badgeIcon={<SearchIcon />}
      title={query ? <>Suche nach <em>„{query}“</em></> : <>Was <em>suchst</em> Du?</>}
      lead={<p>Finde Artikel aus unserem Magazin, Städte- und Regionsseiten sowie Begriffe aus dem Lexikon.</p>}
      className="ss-hero"
    >
      <div className="ss-box"><SiteSearchForm defaultValue={query} id="site-search-page-q" label="Suchbegriff" autoFocus={!query} /></div>
    </AboutHero>

    <div className="wrap ss-body">
      {!query ? <section className="ss-empty" aria-labelledby="ss-start-title">
        <span className="ss-empty-icon" aria-hidden="true"><SearchIcon /></span>
        <h2 id="ss-start-title">Starte mit einem Stichwort</h2>
        <p>Gib zum Beispiel Deine Stadt ein, ein Thema wie „Coming-out“ oder einen Begriff, über den Du mehr wissen möchtest.</p>
        <ul className="ss-suggestions" aria-label="Beliebte Suchen">{SUGGESTIONS.map((term) => <li key={term}><Link href={queryHref(term)}>{term}</Link></li>)}</ul>
      </section> : all.length ? <section aria-labelledby="site-search-results-title">
        <div className="ss-results-head">
          <h2 id="site-search-results-title" className="ss-count">{total === 1 ? "1 Treffer" : `${total} Treffer`} für „{query}“{activeType ? ` in ${activeType.label}` : ""}</h2>
          <nav className="ss-filters" aria-label="Nach Typ filtern">
            <ul>
              <li><Link className={`ss-filter${activeType ? "" : " is-active"}`} href={queryHref(query)} aria-current={activeType ? undefined : "true"}>Alle <span>{all.length}</span></Link></li>
              {counts.map((type) => <li key={type.key}><Link className={`ss-filter ss-type-${type.key}${activeType?.key === type.key ? " is-active" : ""}`} href={queryHref(query, type.key)} aria-current={activeType?.key === type.key ? "true" : undefined}>{type.icon}{type.label} <span>{type.count}</span></Link></li>)}
            </ul>
          </nav>
        </div>
        {results.length ? <ol className="ss-results">
          {results.map((result) => {
            const type = typeFor(result.section);
            return <li key={result.href}>
              <Link className={`ss-result ss-type-${type.key}`} href={result.href}>
                <span className="ss-result-icon" aria-hidden="true">{type.icon}</span>
                <span className="ss-result-body">
                  <span className="ss-chip">{result.section}</span>
                  <strong>{highlight(result.title, query)}</strong>
                  {result.excerpt ? <span className="ss-excerpt">{result.excerpt}</span> : null}
                  <span className="ss-url">{displayPath(result.href)}</span>
                </span>
                <span className="ss-result-arrow" aria-hidden="true"><ArrowIcon /></span>
              </Link>
            </li>;
          })}
        </ol> : <p className="ss-none">In diesem Bereich gibt es keine Treffer. <Link href={queryHref(query)}>Alle Treffer zeigen</Link></p>}
        {!activeType && all.length > SITE_SEARCH_MAX_RESULTS ? <p className="ss-none">Es werden die {SITE_SEARCH_MAX_RESULTS} besten Treffer gezeigt – grenze die Suche mit einem Filter oder einem genaueren Begriff ein.</p> : null}
      </section> : <section className="ss-empty" aria-labelledby="ss-none-title">
        <span className="ss-empty-icon" aria-hidden="true"><SearchIcon /></span>
        <h2 id="ss-none-title">Leider nichts gefunden für „{query}“</h2>
        <p>Probier es mit einem anderen oder kürzeren Begriff – oder stöbere direkt im <Link href="/magazin">Magazin</Link>, in der <Link href="/partnersuche">Partnersuche nach Städten</Link> oder im <Link href="/lexikon">Lexikon</Link>.</p>
        <ul className="ss-suggestions" aria-label="Beliebte Suchen">{SUGGESTIONS.map((term) => <li key={term}><Link href={queryHref(term)}>{term}</Link></li>)}</ul>
      </section>}
    </div>
  </main>;
}

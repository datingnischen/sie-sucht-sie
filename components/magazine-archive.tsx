import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine-breadcrumbs";
import type { MagazineEntry } from "@/lib/magazine";

export function MagazineArchive({ kicker, title, intro, entries, aside }: { kicker: string; title: string; intro: string; entries: MagazineEntry[]; aside?: React.ReactNode }) {
  const grid = entries.length > 0 ? <div className="magazine-card-grid">{entries.map((entry) => <article className="magazine-card" key={entry.id}><Link href={entry.path}>{entry.featuredImage ? <span className="magazine-card-media"><img src={entry.featuredImage} alt="" loading="lazy" /></span> : <span className="magazine-card-media magazine-card-fallback" aria-hidden="true" />}<div className="magazine-card-copy"><span>{entry.categories[0]?.name || "Magazin"}</span><h2>{entry.title}</h2><p>{entry.description}</p><small>Artikel lesen →</small></div></Link></article>)}</div> : <div className="magazine-empty"><h2>Hier gibt es derzeit keine Beiträge.</h2><p>Im Magazin findest Du weitere Themen rund um Dating, Beziehungen und lesbisches Leben.</p><Link className="button button-pink" href="/magazin">Zum Magazin</Link></div>;
  return (
    <main className="magazine-main">
      <section className="magazine-archive-hero"><div className="wrap"><MagazineBreadcrumbs current={title} /><p className="kicker">{kicker}</p><h1>{title}</h1><p>{intro}</p></div></section>
      <section className="wrap magazine-section">
        {aside ? <div className="magazine-archive-layout">{grid}{aside}</div> : grid}
      </section>
    </main>
  );
}

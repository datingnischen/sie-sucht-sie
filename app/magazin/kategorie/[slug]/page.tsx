import Link from "@/components/link";
import { staticAsset } from "@/lib/static-asset.mjs";
import { MagazineArchiveHero, MagazineCardGrid, MagazineFilterChips } from "@/components/magazine-archive";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MagazineArchive } from "@/components/magazine-archive";
import { MagazineCategoryIcon } from "@/components/magazine/category-icon";
import { readingMinutes } from "@/components/magazine/content";
import { MagazineHubGroups } from "@/components/magazine/hub-groups";
import { MagazineMedia } from "@/components/magazine/magazine-card";
import { HUBS } from "@/lib/magazine-hubs";
import { PortalRankingSidebar } from "@/components/portal-ranking-sidebar";
import { getMagazineCategory, magazineCategories, postsForMagazineCategory } from "@/lib/magazine";
import { PORTAL_RANKING_CATEGORY } from "@/lib/portal-ranking";
import { registrationUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return magazineCategories.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };

// Eigener Seitentitel für Kategorien mit Hub-Inhalt; alle anderen tragen den Kategorienamen.
const CATEGORY_TITLES: Record<string, string> = {
  nachtleben: "Lesbisches Nachtleben: Bars, Partys & Festivals",
  lesbenportale: "Lesbenportale und Communitys im Überblick",
  ratgeber: "Ratgeber für lesbische Frauen – Themen im Überblick",
  "tv-shows": "Queere Dating-Shows: Princess Charming & Co.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getMagazineCategory((await params).slug);
  if (!category) return { robots: { index: false, follow: false } };
  // Indexierbar ist eine Kategorie erst, wenn sie eine eigene Beschreibung hat; reine Beitragslisten bleiben noindex.
  return { title: CATEGORY_TITLES[category.slug] ?? `${category.name} im Sie-sucht-Sie Magazin`, description: category.description || `Beiträge aus der Kategorie ${category.name}.`, alternates: { canonical: `https://www.sie-sucht-sie.de/magazin/kategorie/${category.slug}/` }, robots: { index: Boolean(category.description), follow: true } };
}

export default async function CategoryPage({ params }: Props) {
  const category = getMagazineCategory((await params).slug);
  if (!category) notFound();
  const entries = postsForMagazineCategory(category.id);
  if (category.slug === "nachtleben") {
    return (
      <main className="mz-main">
        <MagazineArchiveHero
          kicker="Sie sucht Sie Magazin"
          title="Lesbisches und queeres Nachtleben"
          crumb={category.name}
          intro={<p>Finde Bars, Partys und Festivals für deinen nächsten Abend. Die Szeneguides zeigen dir, wo du anfangen kannst.</p>}
          visual={<figure className="mz-hero-arch">
            <img src={staticAsset("/magazine/media/nachtleben-titel.webp")} alt="Frauen unterhalten sich an einer Bar im warmen Clublicht." width={1200} height={800} fetchPriority="high" />
          </figure>}
        />
        <MagazineFilterChips active={category.slug} />
        <section className="wrap mz-section mz-archive-list mz-nightlife" aria-labelledby="szene-vor-ort">
          <h2 id="szene-vor-ort">Bars und Clubs nach Stadt</h2>
          <p>Schau vor dem Besuch ins Programm der Location. Zielgruppe, Einlass und Öffnungszeiten können sich je nach Abend unterscheiden.</p>
          <ul className="mz-nightlife-cities">
            {[
              ["Berlin", "lesbische-szenebars-in-berlin"],
              ["Düsseldorf", "lesbische-szenebars-in-duesseldorf"],
              ["Frankfurt", "lesbenbars-in-frankfurt"],
              ["Hamburg", "lesbische-szenebars-in-hamburg"],
              ["Köln", "lesbische-szenebars-in-koeln"],
              ["Leipzig", "lesbische-szenebars-in-leipzig"],
              ["Nürnberg", "lesbische-szenebars-in-nuernberg"],
            ].map(([city, slug]) => <li key={slug}><Link href={`/magazin/${slug}`}>{city}</Link></li>)}
          </ul>
          <p><Link href="/magazin/lesbische-szenebars">Alle Szenebars und Clubs</Link> · <Link href="/magazin/lesben-staedte-szene">Städte- und Szene-Guide für Deutschland, Österreich und die Schweiz</Link></p>
        </section>
        <section className="wrap mz-section mz-archive-list" aria-label="Ratgeber zum Ausgehen">
          <MagazineCardGrid entries={entries} />
          <figure className="mz-nightlife-infographic">
            <img src={staticAsset("/magazine/media/erster-partyabend-infografik.webp")} alt="Dein erster Partyabend in drei Schritten: Abend auswählen, Einlass prüfen und Heimweg planen." width={1200} height={614} loading="lazy" />
          </figure>
        </section>
      </main>
    );
  }
  const years = entries.map((entry) => entry.date.slice(0, 4)).sort();
  const minutes = entries.reduce((sum, entry) => sum + readingMinutes(entry.contentHtml), 0);
  const cover = entries.find((entry) => entry.featuredImage);
  const hub = HUBS[category.slug];
  if (hub) {
    // Hub mit Themengruppen: Die Datumsliste steht nur noch als „Neu“-Block darunter.
    return (
      <main className="mz-main">
        <MagazineArchiveHero
          kicker="Magazin-Thema"
          kickerIcon={<MagazineCategoryIcon slug={category.slug} />}
          title={hub.heading}
          crumb={category.name}
          intro={<p>{hub.lead}</p>}
          stats={[
            { value: entries.length, label: "Beiträge" },
            { value: `${minutes} Min.`, label: "Lesestoff" },
            { value: hub.groups.length, label: "Themenfelder" },
          ]}
          visual={cover ? (
            <figure className="mz-hero-arch" aria-hidden="true">
              <MagazineMedia entry={cover} eager />
              <span className="mz-hero-arch-icon"><MagazineCategoryIcon slug={category.slug} /></span>
            </figure>
          ) : undefined}
        />
        <MagazineFilterChips active={category.slug} />
        <section className="wrap mz-section mz-archive-list" aria-label="Themen">
          <MagazineHubGroups entries={entries} groups={hub.groups} />
        </section>
        <section className="wrap mz-section mz-archive-list" aria-labelledby="neu-im-thema">
          <h2 id="neu-im-thema">Neueste Beiträge</h2>
          <MagazineCardGrid entries={entries.slice(0, 3)} />
        </section>
      </main>
    );
  }
  return (
    <MagazineArchive
      kicker="Magazin-Thema"
      kickerIcon={<MagazineCategoryIcon slug={category.slug} />}
      title={category.name}
      crumb={category.name}
      intro={<p>{category.description || `Alle Beiträge aus der Kategorie ${category.name} – die neuesten zuerst.`}</p>}
      stats={[
        { value: entries.length, label: entries.length === 1 ? "Beitrag" : "Beiträge" },
        { value: `${minutes} Min.`, label: "Lesestoff" },
        ...(years.length ? [{ value: years[0] === years.at(-1) ? years[0] : `${years[0]}–${years.at(-1)}`, label: "Jahrgänge" }] : []),
      ]}
      visual={cover ? (
        <figure className="mz-hero-arch" aria-hidden="true">
          <MagazineMedia entry={cover} eager />
          <span className="mz-hero-arch-icon"><MagazineCategoryIcon slug={category.slug} /></span>
        </figure>
      ) : undefined}
      active={category.slug}
      entries={entries}
      aside={category.slug === PORTAL_RANKING_CATEGORY ? <PortalRankingSidebar registrationHref={registrationUrl(`/magazin/kategorie/${category.slug}`)} /> : undefined}
    />
  );
}

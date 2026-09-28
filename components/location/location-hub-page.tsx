import type { CSSProperties } from "react";
import Link from "next/link";
import { publicPages } from "@/lib/content";
import { registrationUrl } from "@/lib/site";
import { getMagazineEntry } from "@/lib/magazine";
import { buildCityCards } from "@/lib/location-hub.mjs";
import { buildCityGuide, selectCityPhoto } from "@/lib/city-guide.mjs";
import { COUNTRY_BY_ROOT, citiesOfRoot } from "@/lib/city-geo.mjs";
import { getCountryMap, getCountryOutline } from "@/lib/city-map.mjs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CitySearchFallback } from "@/components/city-search-fallback";
import { ArrowIcon, HeartFilledIcon, VenusPairIcon } from "@/components/icons";
import type { ImportedView } from "@/components/imported-view";
import { CityFinder, type FinderRegion } from "./city-finder";
import { TOP_TEN_BY_ROOT, emphasize } from "./city-shared";
import "./sc-city.css";
import "./sc-hub.css";

type Root = "partnersuche" | "oesterreich" | "schweiz";

const ROOTS: Root[] = ["partnersuche", "oesterreich", "schweiz"];

const HERO_ACCENT: Record<Root, string> = {
  partnersuche: "Umgebung",
  oesterreich: "Österreich",
  schweiz: "Schweiz",
};

function regionsOf(root: Root): FinderRegion[] {
  const teasers = new Map((buildCityCards(publicPages, root) as { path: string; teaser: string }[]).map((card) => [card.path, card.teaser]));
  const groups = new Map<string, FinderRegion["cities"]>();
  for (const city of citiesOfRoot(root)) {
    const page = publicPages.find((entry) => entry.path === city.path);
    if (!page) continue;
    const photo = selectCityPhoto(page.images);
    const list = groups.get(city.region) ?? [];
    list.push({ path: city.path, name: city.name, teaser: teasers.get(city.path) ?? `Frauen aus ${city.name} kennenlernen.`, photo: photo ? { src: photo.src, alt: photo.alt } : null });
    groups.set(city.region, list);
  }
  return [...groups]
    .map(([name, cities]) => ({ name, cities }))
    .sort((a, b) => b.cities.length - a.cities.length || a.name.localeCompare(b.name, "de"));
}

/** Erstes Bild aus dem Text lösen (wird als Bogenfenster neben der Einleitung gezeigt). */
function splitFirstImage(html: string) {
  const match = html.match(/<p>\s*(<img\b[^>]*>)\s*<\/p>|(<img\b[^>]*>)/i);
  if (!match) return { html, image: null };
  const tag = match[1] ?? match[2];
  const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
  const alt = tag.match(/\balt="([^"]*)"/i)?.[1] ?? "";
  return src ? { html: html.replace(match[0], "").trim(), image: { src, alt } } : { html, image: null };
}

function CountryShape({ root, className }: { root: Root; className?: string }) {
  const outline = getCountryOutline(root);
  return (
    <svg className={className} viewBox={`-10 -10 ${outline.width + 20} ${outline.height + 20}`} aria-hidden="true">
      <path d={outline.path} />
    </svg>
  );
}

export function LocationHubPage({ page, path, image, contentHtml, breadcrumbs, root }: ImportedView & { root: Root }) {
  const country = COUNTRY_BY_ROOT[root];
  const map = getCountryMap(root);
  const regions = regionsOf(root);
  const cityCount = regions.reduce((sum, region) => sum + region.cities.length, 0);
  const signupUrl = registrationUrl(path);
  const guide = buildCityGuide({ contentHtml, path });
  const intro = splitFirstImage(guide.introHtml);
  const heroImage = image && selectCityPhoto([image]) ? image : null;
  const storyImage = intro.image ?? heroImage;
  const topTen = getMagazineEntry(TOP_TEN_BY_ROOT[root]);
  const otherRoots = ROOTS.filter((entry) => entry !== root);
  const countryCards = (
    <section className="sc-wrap sc-section sh-countries" aria-labelledby="sh-countries-title">
      <div className="sc-head">
        <p className="kicker">{root === "partnersuche" ? "Auch in den Nachbarländern" : "Über die Grenze schauen"}</p>
        <h2 id="sh-countries-title">{root === "partnersuche" ? <>Österreich &amp; <em>Schweiz</em></> : <>Weitere <em>Länder</em></>}</h2>
      </div>
      <div className="sh-country-grid">
        {otherRoots.map((entry, index) => {
          const other = COUNTRY_BY_ROOT[entry];
          const count = citiesOfRoot(entry).length;
          const featured = (buildCityCards(publicPages, entry) as { name: string }[]).slice(0, 3).map((card) => card.name);
          return (
            <Link key={entry} className="sh-country" href={`/${entry}`} style={{ "--tilt": `${index % 2 ? 1.2 : -1.2}deg` } as CSSProperties}>
              <CountryShape root={entry} className="sh-country-shape" />
              <span className="sh-country-copy">
                <small>Sie sucht Sie {other.inName.replace(/\s*\S+$/, "")}</small>
                <strong>{other.name}</strong>
                <span>{count} Stadtseiten · {featured.join(", ")} …</span>
                <em>Städte ansehen <ArrowIcon /></em>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );

  return (
    <main className="sc sh">
      <section className="sc-hero sh-hero">
        <span className="sc-hero-pattern" aria-hidden="true" />
        <span className="sc-hero-glow" aria-hidden="true" />
        <div className="sc-wrap sh-hero-grid">
          <div className="sc-hero-copy">
            <Breadcrumbs items={breadcrumbs} className="sc-crumbs" />
            <span className="sc-badge"><VenusPairIcon />Partnersuche für Frauen · {country.name}</span>
            <h1>{emphasize(page.h1, HERO_ACCENT[root])}</h1>
            <p className="sc-lead">{page.description}</p>
            <ul className="sh-stats">
              <li><strong>{cityCount}</strong><span>Städte mit Queer-Guide</span></li>
              <li><strong>{regions.length}</strong><span>{country.regionLabelPlural}</span></li>
              <li><strong><HeartFilledIcon /></strong><span>kostenlos anmelden</span></li>
            </ul>
            <div className="sc-actions">
              <a className="button button-green" href={signupUrl}><HeartFilledIcon />Kostenlos anmelden</a>
              <a className="button button-ghost-light" href="#staedte">Deine Stadt finden <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <div className={`sh-map-stack sh-map-${country.code}`}>
          <span className="sh-map-back" aria-hidden="true" />
          <figure className="sh-map">
            <svg viewBox={`-70 -30 ${map.width + 140} ${map.height + 60}`} role="img" aria-label={`Karte: Stadtseiten von Sie-sucht-Sie.de in ${country.name}`}>
              <defs>
                <pattern id={`sh-dots-${country.code}`} width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="11" cy="11" r="1.8" className="sh-map-dot" />
                </pattern>
                <linearGradient id={`sh-pin-${country.code}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f65a70" />
                  <stop offset="1" stopColor="#d6337a" />
                </linearGradient>
              </defs>
              <path className="sh-map-land" d={map.path} />
              <path d={map.path} fill={`url(#sh-dots-${country.code})`} />
              {map.cities.map((city, index) => (
                <Link key={city.path} className="sh-pin" href={city.path}>
                  <title>{`Sie sucht Sie in ${city.name}`}</title>
                  <circle className="sh-pin-pulse" cx={city.x} cy={city.y} r="18" style={{ animationDelay: `${(index % 7) * 0.45}s` }} />
                  <path className="sh-pin-heart" transform={`translate(${city.x - 19} ${city.y - 19}) scale(1.6)`} d="M12 21s-8.4-5-8.4-11.3A4.8 4.8 0 0 1 12 6.8a4.8 4.8 0 0 1 8.4 2.9C20.4 16 12 21 12 21Z" fill={`url(#sh-pin-${country.code})`} />
                  {city.label ? <text x={city.label.x} y={city.label.y} textAnchor={city.label.anchor}>{city.name}</text> : null}
                </Link>
              ))}
            </svg>
            <figcaption><HeartFilledIcon />Jedes Herz führt zu einem Stadt-Guide</figcaption>
          </figure>
          </div>
        </div>
        <svg className="sc-hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 58c220 30 470 34 720 10s520-44 720-12v34H0Z" /></svg>
      </section>

      <section id="staedte" className="sc-wrap sh-cities" aria-labelledby="sh-cities-title">
        <div className="sh-panel">
          <div className="sc-head">
            <p className="kicker">Städteübersicht {country.name}</p>
            <h2 id="sh-cities-title">Wähle Deine Stadt – <em>und Deinen Queer-Guide</em></h2>
            <p>Jede Stadtseite verbindet Profilvorschauen von Frauen aus der Region mit Bars, Events, Community-Treffs und Date-Ideen vor Ort.</p>
          </div>
          <CityFinder regions={regions} regionLabel={country.regionLabel} countryName={country.name} />
          <CitySearchFallback headingId={`${root}-city-search-fallback-title`} />
        </div>
      </section>

      {root === "partnersuche" ? countryCards : null}

      <section className="sc-wrap sc-section sh-story" aria-label={`Sie sucht Sie ${country.inName}`}>
        <article className={`sh-story-card${storyImage ? "" : " sh-story-card-text"}`}>
          <div className="sh-story-copy">
            <p className="kicker">Sie sucht Sie {country.inName}</p>
            {intro.html ? <div className="sc-rich sh-story-rich" dangerouslySetInnerHTML={{ __html: intro.html }} /> : null}
            <a className="button button-green" href={signupUrl}><HeartFilledIcon />Jetzt kostenlos anmelden</a>
          </div>
          {storyImage ? (
            <figure className="sh-arch">
              <span className="sh-arch-back" aria-hidden="true" />
              <img src={storyImage.src} alt={storyImage.alt || `Frauen, die Frauen lieben, in ${country.name}`} loading="lazy" decoding="async" />
            </figure>
          ) : null}
        </article>
        {guide.sections.length ? (
          <div className="sh-story-sections">
            {guide.sections.map((section, index) => (
              <article key={section.id} className="sh-story-section">
                <span className="sh-story-no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.html ? <div className="sc-rich" dangerouslySetInnerHTML={{ __html: section.html }} /> : null}
              </article>
            ))}
          </div>
        ) : null}
        {guide.credits.length ? (
          <p className="sh-credits">
            Bildquellen:{" "}
            {guide.credits.map((credit, index) => (
              <span key={credit.url}>{index ? ", " : ""}<a href={credit.url} target="_blank" rel="nofollow noopener noreferrer">{credit.label} {index + 1}</a></span>
            ))}
          </p>
        ) : null}
      </section>

      {root !== "partnersuche" ? countryCards : null}

      {topTen ? (
        <section className="sc-wrap sc-section" aria-labelledby="sh-mag-title">
          <Link className="sh-topten" href={topTen.path}>
            <span className="sh-topten-media">{topTen.featuredImage ? <img src={topTen.featuredImage} alt="" loading="lazy" decoding="async" /> : <VenusPairIcon />}</span>
            <span className="sh-topten-copy">
              <small className="kicker">Aus dem Magazin</small>
              <strong id="sh-mag-title">{topTen.title}</strong>
              <span>{topTen.description.length > 180 ? `${topTen.description.slice(0, 177).replace(/\s+\S*$/, "")} …` : topTen.description}</span>
              <em>Ranking lesen <ArrowIcon /></em>
            </span>
          </Link>
        </section>
      ) : null}

    </main>
  );
}

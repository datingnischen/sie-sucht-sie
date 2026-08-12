import type { ImportedPage } from "@/lib/content";
import Link from "next/link";
import { buildCityCards } from "@/lib/location-hub.mjs";

type CityCard = {
  path: string;
  name: string;
  teaser: string;
  image: { src: string; alt: string } | null;
  registrationUrl: string;
};

export function CityCardSection({ pages }: { pages: ImportedPage[] }) {
  const cities = buildCityCards(pages, "partnersuche") as CityCard[];

  return (
    <section className="city-explorer" aria-labelledby="city-explorer-title">
      <div className="city-explorer-heading">
        <div>
          <p className="kicker">Deutschland entdecken</p>
          <h2 id="city-explorer-title">Wähle Deine Stadt</h2>
        </div>
        <p>Von Berlin bis Freiburg: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.</p>
      </div>
      <div className="city-card-grid">
        {cities.map((city, index) => (
          <article className={`city-tile city-tile-tone-${index % 6}${index < 6 ? " city-tile-featured" : ""}${city.image ? "" : " city-tile-no-image"}`} key={city.path}>
            <Link href={city.path} aria-label={`Partnersuche in ${city.name} entdecken`}>
              {city.image ? <img src={city.image.src} alt={city.image.alt || `Stadtansicht von ${city.name}`} loading={index < 6 ? "eager" : "lazy"} /> : null}
              <span className="city-tile-shade" aria-hidden="true" />
              <span className="city-tile-content">
                <span className="city-tile-meta"><span className="city-pin" aria-hidden="true">⌖</span> Partnersuche vor Ort</span>
                <strong>{city.name}</strong>
                <span className="city-tile-teaser">{city.teaser}</span>
                <span className="city-tile-action">Stadt entdecken <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          </article>
        ))}
      </div>
      <div className="city-explorer-cta">
        <div><strong>Deine Stadt ist schon dabei.</strong><span>Starte kostenlos und finde Frauen aus Deiner Nähe.</span></div>
        <a className="button button-green" href={cities[0]?.registrationUrl}>Frauen in meiner Region finden</a>
      </div>
    </section>
  );
}

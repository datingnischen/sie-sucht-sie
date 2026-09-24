import { getIndividualSearchUrl } from "@/lib/location-search.mjs";

export function CitySearchFallback({ headingId }: { headingId: string }) {
  return (
    <aside className="city-search-fallback" aria-labelledby={headingId}>
      <div className="city-search-fallback-copy">
        <p className="kicker">Individuelle Suche</p>
        <h2 id={headingId}>Deine Stadt fehlt? Frauen, die Frauen suchen, gibt es auch bei Dir.</h2>
        <p>
          Nicht jede Stadt hat eine eigene Seite. In der individuellen Suche legst Du Ort, Umkreis und Alter selbst fest
          und siehst, welche Frauen in Deiner Nähe auf der Suche sind.
        </p>
      </div>
      <a className="button button-pink" href={getIndividualSearchUrl()}>Zur individuellen Suche</a>
    </aside>
  );
}

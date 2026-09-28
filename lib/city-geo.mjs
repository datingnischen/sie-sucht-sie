/**
 * Geografie der 49 Stadtseiten: nur für Entfernungen (Luftlinie), Regionsangaben und die Landeskarten.
 * Koordinaten = Stadtzentrum (Rathaus/Altstadt), gerundet auf vier Nachkommastellen.
 * Regionen: Bundesland (DE/AT) bzw. Kanton (CH).
 */

export const COUNTRY_BY_ROOT = Object.freeze({
  partnersuche: { code: "de", name: "Deutschland", inName: "in Deutschland", icony: 49, regionLabel: "Bundesland", regionLabelPlural: "Bundesländer" },
  oesterreich: { code: "at", name: "Österreich", inName: "in Österreich", icony: 43, regionLabel: "Bundesland", regionLabelPlural: "Bundesländer" },
  schweiz: { code: "ch", name: "Schweiz", inName: "in der Schweiz", icony: 41, regionLabel: "Kanton", regionLabelPlural: "Kantone" },
});

/** @type {Readonly<Record<string, { name: string; lat: number; lon: number; region: string }>>} */
export const CITY_GEO = Object.freeze({
  "/partnersuche/aachen": { name: "Aachen", lat: 50.7753, lon: 6.0839, region: "Nordrhein-Westfalen" },
  "/partnersuche/augsburg": { name: "Augsburg", lat: 48.3705, lon: 10.8978, region: "Bayern" },
  "/partnersuche/berlin": { name: "Berlin", lat: 52.52, lon: 13.405, region: "Berlin" },
  "/partnersuche/bremen": { name: "Bremen", lat: 53.0793, lon: 8.8017, region: "Bremen" },
  "/partnersuche/dortmund": { name: "Dortmund", lat: 51.5136, lon: 7.4653, region: "Nordrhein-Westfalen" },
  "/partnersuche/dresden": { name: "Dresden", lat: 51.0504, lon: 13.7373, region: "Sachsen" },
  "/partnersuche/duesseldorf": { name: "Düsseldorf", lat: 51.2277, lon: 6.7735, region: "Nordrhein-Westfalen" },
  "/partnersuche/duisburg": { name: "Duisburg", lat: 51.4344, lon: 6.7623, region: "Nordrhein-Westfalen" },
  "/partnersuche/essen": { name: "Essen", lat: 51.4556, lon: 7.0116, region: "Nordrhein-Westfalen" },
  "/partnersuche/frankfurt-am-main": { name: "Frankfurt am Main", lat: 50.1109, lon: 8.6821, region: "Hessen" },
  "/partnersuche/freiburg": { name: "Freiburg", lat: 47.999, lon: 7.8421, region: "Baden-Württemberg" },
  "/partnersuche/goeppingen": { name: "Göppingen", lat: 48.7035, lon: 9.6523, region: "Baden-Württemberg" },
  "/partnersuche/hamburg": { name: "Hamburg", lat: 53.5511, lon: 9.9937, region: "Hamburg" },
  "/partnersuche/hannover": { name: "Hannover", lat: 52.3759, lon: 9.732, region: "Niedersachsen" },
  "/partnersuche/heidelberg": { name: "Heidelberg", lat: 49.3988, lon: 8.6724, region: "Baden-Württemberg" },
  "/partnersuche/karlsruhe": { name: "Karlsruhe", lat: 49.0069, lon: 8.4037, region: "Baden-Württemberg" },
  "/partnersuche/kassel": { name: "Kassel", lat: 51.3127, lon: 9.4797, region: "Hessen" },
  "/partnersuche/koeln": { name: "Köln", lat: 50.9375, lon: 6.9603, region: "Nordrhein-Westfalen" },
  "/partnersuche/leipzig": { name: "Leipzig", lat: 51.3397, lon: 12.3731, region: "Sachsen" },
  "/partnersuche/magdeburg": { name: "Magdeburg", lat: 52.1205, lon: 11.6276, region: "Sachsen-Anhalt" },
  "/partnersuche/mainz": { name: "Mainz", lat: 49.9929, lon: 8.2473, region: "Rheinland-Pfalz" },
  "/partnersuche/muenchen": { name: "München", lat: 48.1351, lon: 11.582, region: "Bayern" },
  "/partnersuche/nuernberg": { name: "Nürnberg", lat: 49.4521, lon: 11.0767, region: "Bayern" },
  "/partnersuche/stuttgart": { name: "Stuttgart", lat: 48.7758, lon: 9.1829, region: "Baden-Württemberg" },
  "/oesterreich/dornbirn": { name: "Dornbirn", lat: 47.4125, lon: 9.7417, region: "Vorarlberg" },
  "/oesterreich/graz": { name: "Graz", lat: 47.0707, lon: 15.4395, region: "Steiermark" },
  "/oesterreich/innsbruck": { name: "Innsbruck", lat: 47.2692, lon: 11.4041, region: "Tirol" },
  "/oesterreich/klagenfurt": { name: "Klagenfurt", lat: 46.6247, lon: 14.3053, region: "Kärnten" },
  "/oesterreich/linz": { name: "Linz", lat: 48.3069, lon: 14.2858, region: "Oberösterreich" },
  "/oesterreich/salzburg": { name: "Salzburg", lat: 47.8095, lon: 13.055, region: "Salzburg" },
  "/oesterreich/sankt-poelten": { name: "Sankt Pölten", lat: 48.2047, lon: 15.6256, region: "Niederösterreich" },
  "/oesterreich/villach": { name: "Villach", lat: 46.6103, lon: 13.8558, region: "Kärnten" },
  "/oesterreich/wels": { name: "Wels", lat: 48.1575, lon: 14.0289, region: "Oberösterreich" },
  "/oesterreich/wien": { name: "Wien", lat: 48.2082, lon: 16.3738, region: "Wien" },
  "/schweiz/basel": { name: "Basel", lat: 47.5596, lon: 7.5886, region: "Kanton Basel-Stadt" },
  "/schweiz/bern": { name: "Bern", lat: 46.948, lon: 7.4474, region: "Kanton Bern" },
  "/schweiz/biel": { name: "Biel", lat: 47.1368, lon: 7.2468, region: "Kanton Bern" },
  "/schweiz/chur": { name: "Chur", lat: 46.8508, lon: 9.532, region: "Kanton Graubünden" },
  "/schweiz/koeniz": { name: "Köniz", lat: 46.9241, lon: 7.4146, region: "Kanton Bern" },
  "/schweiz/lausanne": { name: "Lausanne", lat: 46.5197, lon: 6.6323, region: "Kanton Waadt" },
  "/schweiz/luzern": { name: "Luzern", lat: 47.0502, lon: 8.3093, region: "Kanton Luzern" },
  "/schweiz/schaffhausen": { name: "Schaffhausen", lat: 47.6973, lon: 8.6349, region: "Kanton Schaffhausen" },
  "/schweiz/sion": { name: "Sion", lat: 46.2331, lon: 7.3606, region: "Kanton Wallis" },
  "/schweiz/st-gallen": { name: "St. Gallen", lat: 47.4245, lon: 9.3767, region: "Kanton St. Gallen" },
  "/schweiz/thun": { name: "Thun", lat: 46.758, lon: 7.628, region: "Kanton Bern" },
  "/schweiz/uster": { name: "Uster", lat: 47.3471, lon: 8.7209, region: "Kanton Zürich" },
  "/schweiz/winterthur": { name: "Winterthur", lat: 47.4988, lon: 8.7237, region: "Kanton Zürich" },
  "/schweiz/zuerich": { name: "Zürich", lat: 47.3769, lon: 8.5417, region: "Kanton Zürich" },
  "/schweiz/zug": { name: "Zug", lat: 47.1662, lon: 8.5155, region: "Kanton Zug" },
});

function stripSlash(path) {
  return typeof path === "string" ? path.replace(/\/+$/, "") || "/" : "";
}

export function cityGeo(path) {
  return CITY_GEO[stripSlash(path)] ?? null;
}

export function rootOf(path) {
  return stripSlash(path).split("/")[1] || "";
}

/** Luftlinie in ganzen Kilometern (Haversine, Erdradius 6371 km). */
export function distanceKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

/**
 * Nächste Stadtseiten ab `path`, länderübergreifend (Basel ↔ Freiburg, Dornbirn ↔ St. Gallen).
 * @returns {{ path: string; name: string; region: string; country: string; km: number }[]}
 */
export function nearestCities(path, count = 5) {
  const origin = cityGeo(path);
  if (!origin) return [];
  const self = stripSlash(path);
  return Object.entries(CITY_GEO)
    .filter(([other]) => other !== self)
    .map(([other, geo]) => ({ path: other, name: geo.name, region: geo.region, country: COUNTRY_BY_ROOT[rootOf(other)].name, km: distanceKm(origin, geo) }))
    .sort((a, b) => a.km - b.km || a.name.localeCompare(b.name, "de"))
    .slice(0, count);
}

/** Stadtseiten eines Landes (Wurzelpfad), alphabetisch. */
export function citiesOfRoot(root) {
  return Object.entries(CITY_GEO)
    .filter(([path]) => rootOf(path) === root)
    .map(([path, geo]) => ({ path, ...geo }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

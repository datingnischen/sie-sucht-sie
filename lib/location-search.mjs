const SEARCH_BASE_URL = "https://www.sie-sucht-sie.de/suche/";

// Central postcode provenance: OpenPLZ API, fetched 2026-09-08.
// Each postcode below was queried at the corresponding endpoint and retained
// only when OpenPLZ returned the catalog city as its locality or municipality:
// DE https://openplzapi.org/de/Localities?postalCode=<postcode>&page=1&pageSize=50
// AT https://openplzapi.org/at/Localities?postalCode=<postcode>&page=1&pageSize=50
// CH https://openplzapi.org/ch/Localities?postalCode=<postcode>&page=1&pageSize=50
// Strings are intentional: Dresden and Leipzig must retain their leading zero.
export const CITY_POSTCODES = Object.freeze({
  "/partnersuche/aachen": "52062",
  "/partnersuche/augsburg": "86150",
  "/partnersuche/berlin": "10115",
  "/partnersuche/bremen": "28195",
  "/partnersuche/dortmund": "44135",
  "/partnersuche/dresden": "01067",
  "/partnersuche/duesseldorf": "40213",
  "/partnersuche/duisburg": "47051",
  "/partnersuche/essen": "45127",
  "/partnersuche/frankfurt-am-main": "60311",
  "/partnersuche/freiburg": "79098",
  "/partnersuche/goeppingen": "73033",
  "/partnersuche/hamburg": "20095",
  "/partnersuche/hannover": "30159",
  "/partnersuche/heidelberg": "69117",
  "/partnersuche/karlsruhe": "76133",
  "/partnersuche/kassel": "34117",
  "/partnersuche/koeln": "50667",
  "/partnersuche/leipzig": "04109",
  "/partnersuche/magdeburg": "39104",
  "/partnersuche/mainz": "55116",
  "/partnersuche/muenchen": "80331",
  "/partnersuche/nuernberg": "90402",
  "/partnersuche/stuttgart": "70173",
  "/oesterreich/dornbirn": "6850",
  "/oesterreich/graz": "8010",
  "/oesterreich/innsbruck": "6020",
  "/oesterreich/klagenfurt": "9020",
  "/oesterreich/linz": "4020",
  "/oesterreich/salzburg": "5020",
  "/oesterreich/sankt-poelten": "3100",
  "/oesterreich/villach": "9500",
  "/oesterreich/wels": "4600",
  "/oesterreich/wien": "1010",
  "/schweiz/basel": "4001",
  "/schweiz/bern": "3011",
  "/schweiz/biel": "2502",
  "/schweiz/chur": "7000",
  "/schweiz/koeniz": "3098",
  "/schweiz/lausanne": "1003",
  "/schweiz/luzern": "6003",
  "/schweiz/schaffhausen": "8200",
  "/schweiz/sion": "1950",
  "/schweiz/st-gallen": "9000",
  "/schweiz/thun": "3600",
  "/schweiz/uster": "8610",
  "/schweiz/winterthur": "8400",
  "/schweiz/zuerich": "8001",
  "/schweiz/zug": "6300",
});

const POSTCODE_PATTERNS = Object.freeze({
  partnersuche: /^\d{5}$/,
  oesterreich: /^\d{4}$/,
  schweiz: /^\d{4}$/,
});

export function getCitySearchUrl(path, postcodes = CITY_POSTCODES) {
  if (typeof path !== "string" || !postcodes || typeof postcodes !== "object") return null;
  const match = path.match(/^\/(partnersuche|oesterreich|schweiz)\/[a-z0-9-]+$/);
  if (!match || !Object.hasOwn(postcodes, path)) return null;

  const postcode = postcodes[path];
  if (typeof postcode !== "string" || !POSTCODE_PATTERNS[match[1]].test(postcode)) return null;

  return `${SEARCH_BASE_URL}?plz=${postcode}&AID=location`;
}

// Fallback for visitors whose city has no page of its own: the open ICONY
// search on the live domain, where location, radius and age are set freely.
export function getIndividualSearchUrl() {
  return `${SEARCH_BASE_URL}?AID=location`;
}

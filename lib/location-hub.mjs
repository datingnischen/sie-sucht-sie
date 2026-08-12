import { selectHeroImage } from "./hero-image.mjs";
import { getLocationName, getRegistrationUrl } from "./site-contract.mjs";

const FEATURED_CITIES = [
  "berlin",
  "hamburg",
  "muenchen",
  "koeln",
  "frankfurt-am-main",
  "stuttgart",
];

const CITY_TEASERS = Object.freeze({
  berlin: "Großstadtmomente, Kiezleben und neue Begegnungen.",
  hamburg: "Zwischen Alster, Elbe und ehrlichen Gesprächen.",
  muenchen: "Gemeinsam Lieblingsorte in der Isarmetropole entdecken.",
  koeln: "Offen, herzlich und voller Möglichkeiten zum Kennenlernen.",
  "frankfurt-am-main": "Neue Kontakte zwischen Mainufer und Skyline.",
  stuttgart: "Datingideen zwischen Kessel, Kultur und Weinbergen.",
  kassel: "Entspannt kennenlernen mitten in Nordhessen.",
  nuernberg: "Charmante Altstadtmomente und neue Verbindungen.",
  dortmund: "Ruhrgebietsherz trifft auf lebendige Community.",
  leipzig: "Kreative Viertel und viel Raum für neue Nähe.",
  hannover: "Grüne Stadt, kurze Wege und schöne erste Dates.",
  goeppingen: "Persönlich kennenlernen am Rand der Schwäbischen Alb.",
  bremen: "Norddeutsche Gelassenheit für echte Begegnungen.",
  duesseldorf: "Rheinpromenade, Kultur und ein erstes Kennenlernen.",
  dresden: "Romantische Kulissen und lebendige Viertel entdecken.",
  duisburg: "Industriekultur und neue Kontakte im westlichen Ruhrgebiet.",
  mainz: "Lebensfreude am Rhein gemeinsam erleben.",
  augsburg: "Historische Gassen und entspannte Datingmomente.",
  freiburg: "Sonnige Plätze und queeres Leben im Breisgau.",
  heidelberg: "Romantik am Neckar und schöne Begegnungen.",
  essen: "Kultur, Grün und Community mitten im Ruhrgebiet.",
  aachen: "Grenzenlos kennenlernen in der Kaiserstadt.",
  magdeburg: "Neue Lieblingsorte an der Elbe entdecken.",
  karlsruhe: "Fächerstadt, Kultur und neue Verbindungen.",
});

const CARD_IMAGE_EXCLUSIONS = /statistik|statistics|dating-statistik|flirt-statistik|community-in-|lesbisch-in-augsburg|sie-sucht-sie-de-(?:aachen|magdeburg|karlsruhe)/i;

function citySlug(path) {
  return path.split("/").filter(Boolean).at(-1) || "";
}

export function buildCityCards(pages, root = "partnersuche") {
  const prefix = `/${root}/`;
  return pages
    .filter((page) => page.type === "location" && page.path.startsWith(prefix))
    .map((page) => {
      const slug = citySlug(page.path);
      const selectedImage = selectHeroImage(page.images);
      const image = selectedImage && !CARD_IMAGE_EXCLUSIONS.test(selectedImage.src) ? selectedImage : null;
      return {
            path: page.path,
            name: getLocationName(page.path),
            teaser: CITY_TEASERS[slug] || `Frauen aus ${getLocationName(page.path)} kennenlernen und lokale Datingtipps entdecken.`,
            image,
            registrationUrl: getRegistrationUrl(page.path),
            featuredOrder: FEATURED_CITIES.indexOf(slug),
          };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aFeatured = a.featuredOrder >= 0;
      const bFeatured = b.featuredOrder >= 0;
      if (aFeatured && bFeatured) return a.featuredOrder - b.featuredOrder;
      if (aFeatured) return -1;
      if (bFeatured) return 1;
      return a.name.localeCompare(b.name, "de");
    });
}

export function removeLegacyCityLists(html, root = "partnersuche") {
  const cityLink = new RegExp(`href=["']/${root}/`, "i");
  const withoutLists = html.replace(/<ul(?:\s[^>]*)?>[\s\S]*?<\/ul>/gi, (list) => (cityLink.test(list) ? "" : list));
  return withoutLists
    .replace(/<h1>Lesbische Frauen aus deiner Umgebung<\/h1>/i, "")
    .replace(/<p><img[^>]+sie-sucht-sie-de-titelbild[^>]*\/>\s*<\/p>/i, "");
}

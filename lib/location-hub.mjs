import { selectHeroImage } from "./hero-image.mjs";
import { getLocationName, getRegistrationUrl } from "./site-contract.mjs";

const HUB_CONFIG = Object.freeze({
  partnersuche: {
    featured: ["berlin", "hamburg", "muenchen", "koeln", "frankfurt-am-main", "stuttgart"],
    names: {},
    teasers: {
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
    },
  },
  schweiz: {
    featured: ["zuerich", "basel", "bern", "lausanne", "luzern", "zug"],
    names: { "st-gallen": "St. Gallen" },
    teasers: {
      zuerich: "Urbanes Seegefühl und eine lebendige queere Community.",
      basel: "Kultur, Rhein und neue Begegnungen im Dreiländereck.",
      bern: "Charmante Altstadtmomente und entspanntes Kennenlernen.",
      lausanne: "Romandie, Seeblick und Raum für neue Verbindungen.",
      luzern: "Zwischen See und Bergen gemeinsam Lieblingsorte entdecken.",
      zug: "Kleine Stadt, grosse Nähe und schöne erste Dates.",
      winterthur: "Kreative Quartiere und persönliche Begegnungen.",
      "st-gallen": "Ostschweizer Lebensart und neue Kontakte entdecken.",
      biel: "Zweisprachig, offen und wunderbar unkompliziert.",
      thun: "Romantische Momente zwischen Altstadt, See und Alpen.",
      koeniz: "Ruhig kennenlernen – ganz nah an Bern und der Natur.",
      schaffhausen: "Rhein, Altstadt und echte Begegnungen im Norden.",
      chur: "Alpenstadt-Charme und neue Nähe in Graubünden.",
      uster: "Persönliches Dating zwischen Greifensee und Zürich.",
      sion: "Sonne, Weinberge und neue Kontakte im Wallis.",
    },
  },
  oesterreich: {
    featured: ["wien", "graz", "salzburg", "innsbruck", "linz", "klagenfurt"],
    names: {},
    teasers: {
      wien: "Queeres Stadtleben, Kaffeehausmomente und neue Begegnungen.",
      graz: "Südländisches Flair und entspanntes Kennenlernen an der Mur.",
      salzburg: "Kultur, Altstadt und romantische Momente an der Salzach.",
      innsbruck: "Bergblick, lebendige Szene und Dates mitten in Tirol.",
      linz: "Donau, Kultur und neue Verbindungen in Oberösterreich.",
      klagenfurt: "Sonnige Begegnungen zwischen Altstadt und Wörthersee.",
      villach: "Kärntner Lebensfreude und schöne erste Dates.",
      wels: "Unkompliziert kennenlernen im Herzen Oberösterreichs.",
      "sankt-poelten": "Kultur, kurze Wege und persönliche Begegnungen.",
      dornbirn: "Vorarlberger Stadtleben vor beeindruckender Bergkulisse.",
    },
  },
});

const HUB_PRESENTATION = Object.freeze({
  partnersuche: {
    kicker: "Deutschland entdecken",
    heading: "Wähle Deine Stadt",
    intro: "Von Berlin bis Freiburg: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.",
    ctaTitle: "Deine Stadt ist schon dabei.",
    ctaLabel: "Frauen in meiner Region finden",
  },
  schweiz: {
    kicker: "Schweiz entdecken",
    heading: "Wähle Deine Stadt in der Schweiz",
    intro: "Von Zürich bis Sion: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.",
    ctaTitle: "Deine Schweizer Stadt ist schon dabei.",
    ctaLabel: "Frauen in der Schweiz finden",
  },
  oesterreich: {
    kicker: "Österreich entdecken",
    heading: "Wähle Deine Stadt in Österreich",
    intro: "Von Wien bis Dornbirn: Entdecke Datingtipps, Treffpunkte und Frauen aus Deiner Region.",
    ctaTitle: "Deine österreichische Stadt ist schon dabei.",
    ctaLabel: "Frauen in Österreich finden",
  },
});

const CARD_IMAGE_EXCLUSIONS = /statistik|statistics|dating-statistik|flirt-statistik|community-in-|lesbisch-in-augsburg|sie-sucht-sie-de-(?:aachen|magdeburg|karlsruhe)/i;

function citySlug(path) {
  return path.split("/").filter(Boolean).at(-1) || "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getHubPresentation(root = "partnersuche") {
  return HUB_PRESENTATION[root] || HUB_PRESENTATION.partnersuche;
}

export function buildCityCards(pages, root = "partnersuche") {
  const config = HUB_CONFIG[root] || HUB_CONFIG.partnersuche;
  const prefix = `/${root}/`;
  return pages
    .filter((page) => page.type === "location" && page.path.startsWith(prefix))
    .map((page) => {
      const slug = citySlug(page.path);
      const selectedImage = selectHeroImage(page.images);
      const image = selectedImage && root !== "oesterreich" && !CARD_IMAGE_EXCLUSIONS.test(selectedImage.src) ? selectedImage : null;
      const name = config.names[slug] || getLocationName(page.path);
      return {
        path: page.path,
        name,
        teaser: config.teasers[slug] || `Frauen aus ${name} kennenlernen und lokale Datingtipps entdecken.`,
        image,
        registrationUrl: getRegistrationUrl(page.path),
        featuredOrder: config.featured.indexOf(slug),
      };
    })
    .sort((a, b) => {
      const aFeatured = a.featuredOrder >= 0;
      const bFeatured = b.featuredOrder >= 0;
      if (aFeatured && bFeatured) return a.featuredOrder - b.featuredOrder;
      if (aFeatured) return -1;
      if (bFeatured) return 1;
      return a.name.localeCompare(b.name, "de");
    });
}

export function removeLegacyCityLists(html, root = "partnersuche", heading = "") {
  const cityLink = new RegExp(`href=["']/${root}/`, "i");
  let cleaned = html.replace(/<ul(?:\s[^>]*)?>[\s\S]*?<\/ul>/gi, (list) => (cityLink.test(list) ? "" : list));
  if (heading) {
    cleaned = cleaned.replace(new RegExp(`<h1>${escapeRegExp(heading)}</h1>`, "i"), "");
  }
  cleaned = cleaned.replace(/<h2>\s*(?:Schweizer Single-Städte im Überblick)\s*<\/h2>/i, "");
  if (root === "partnersuche") {
    cleaned = cleaned.replace(/<p><img[^>]+sie-sucht-sie-de-titelbild[^>]*\/>\s*<\/p>/i, "");
  } else if (root === "schweiz") {
    cleaned = cleaned.replace(/<p><img[^>]+sie-sucht-sie-schweiz\.jpg[^>]*\/>\s*<\/p>/i, "");
  }
  return cleaned;
}

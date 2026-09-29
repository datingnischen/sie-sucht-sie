/**
 * Eigene Stadtfotos für Stadtseiten ohne (passendes) ICONY-Bild. Dateien liegen in public/cities
 * (1600 px WebP), Quelle Wikimedia Commons – Urheber und Lizenz stehen im Bildnachweis des Heros.
 * `replaces` entfernt ein unpassendes Importbild (Zug zeigte Basler Trams statt der Stadt).
 */
export const CITY_PHOTOS = Object.freeze({
  "/partnersuche/aachen": {
    file: "/cities/aachen.webp",
    alt: "Sie sucht Sie in Aachen – das historische Rathaus am Katschhof",
    credit: { url: "https://commons.wikimedia.org/wiki/File:Aachen,_Rathaus_--_2016_--_2767.jpg", label: "Dietmar Rabich, CC BY-SA 4.0" },
  },
  "/partnersuche/karlsruhe": {
    file: "/cities/karlsruhe.webp",
    alt: "Sie sucht Sie in Karlsruhe – Sommertag im Schlossgarten vor dem Karlsruher Schloss",
    credit: { url: "https://commons.wikimedia.org/wiki/File:Karlsruhe_Palace_with_Pride_Flag.jpg", label: "Killarnee, CC BY-SA 4.0" },
  },
  "/partnersuche/magdeburg": {
    file: "/cities/magdeburg.webp",
    alt: "Sie sucht Sie in Magdeburg – Elbufer mit Blick auf den Dom",
    credit: { url: "https://commons.wikimedia.org/wiki/File:Magdeburg_Elbufer_mit_Dom.jpg", label: "Goodway, CC BY-SA 4.0" },
  },
  "/schweiz/zug": {
    file: "/cities/zug.webp",
    alt: "Sie sucht Sie in Zug – Abendsonne in der Altstadt mit dem Zytturm",
    credit: { url: "https://commons.wikimedia.org/wiki/File:Evening_sunshine_in_the_old_town_of_Zug.jpg", label: "Yggdrasilll, CC BY-SA 4.0" },
    replaces: "Zug-(2).jpg",
  },
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Stellt das eigene Foto an den Anfang der Bildliste und entfernt ein ersetztes Importbild samt Nachweis. */
export function withCityPhoto(page, toAssetUrl = (path) => path) {
  const photo = CITY_PHOTOS[page.path.replace(/\/+$/, "")];
  if (!photo) return page;
  let { images, contentHtml } = page;
  if (photo.replaces) {
    const marker = escapeRegExp(photo.replaces);
    images = images.filter((image) => !image.src.includes(photo.replaces));
    contentHtml = contentHtml
      .replace(new RegExp(`<p>\\s*<img\\b[^>]*${marker}[^>]*>\\s*</p>|<img\\b[^>]*${marker}[^>]*>`, "g"), "")
      .replace(/(?:<hr\s*\/?>\s*)?<p>\s*<small>\s*Bildquelle:[^<]*<\/small>\s*<\/p>/i, "");
  }
  return { ...page, contentHtml, images: [{ src: toAssetUrl(photo.file), alt: photo.alt }, ...images] };
}

export function cityPhotoCredit(path) {
  return CITY_PHOTOS[path.replace(/\/+$/, "")]?.credit ?? null;
}

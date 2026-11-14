/**
 * Themengruppen für Kategorie-Hubs. Eine Kategorie mit vielen Beiträgen ist als Datumsliste
 * unbrauchbar; die Gruppen sortieren sie nach Anliegen. `tests/magazine.test.mjs` prüft, dass
 * jeder Beitrag der Kategorie in genau einer Gruppe steht – ein neuer Beitrag fällt also auf.
 */
export type HubGroup = { heading: string; intro: string; slugs: string[] };

export const RATGEBER_GROUPS: HubGroup[] = [
  {
    heading: "Orientierung finden",
    intro: "Die eigenen Gefühle einordnen, Frauen kennenlernen und den Zeitpunkt für das Coming-out selbst bestimmen.",
    slugs: ["bin-ich-lesbisch", "coming-out", "spaetes-coming-out-frauen", "lesben-erkennen", "lesbentreff"],
  },
  {
    heading: "Sexuelle Orientierungen verstehen",
    intro: "Was die gängigen Begriffe bedeuten – und warum sich niemand für eine Schublade entscheiden muss.",
    slugs: [
      "welche-sexualitaeten-gibt-es",
      "queer",
      "bisexuell-darum-ist-jede-frau-etwas-bi",
      "pansexualitaet",
      "demisexualitaet",
      "asexualitaet",
    ],
  },
  {
    heading: "Geschlecht und Identität",
    intro: "Geschlechtsidentität ist etwas anderes als Orientierung. Diese Beiträge erklären die Unterschiede.",
    slugs: ["geschlechtsidentitaet", "cisgender", "intersexuell", "androgyn", "maskulin-feminin"],
  },
  {
    heading: "Szene, Symbole und Geschichte",
    intro: "Woher Flagge, Begriffe und die wirtschaftliche Bedeutung der Community kommen.",
    slugs: ["lgbt", "lesbenflagge", "rosa-geld"],
  },
  {
    heading: "Dating und Sicherheit",
    intro: "Vom Profilbild bis zum Umgang mit missbrauchten Fotos: wie Du beim Online-Dating gut ankommst und geschützt bleibst.",
    slugs: ["perfekte-profilbild", "sie-sucht-sie-ueber-50", "deepfake-gewalt-dating"],
  },
  {
    heading: "Beziehung führen",
    intro: "Streit, Trennung, Liebeskummer: was in einer Beziehung zwischen zwei Frauen trägt und was hilft, wenn es nicht mehr trägt.",
    slugs: ["lesbische-beziehung", "beziehungsprobleme-loesen", "ich-habe-liebeskummer", "die-ex-zurueckgewinnen"],
  },
  {
    heading: "Sex, Körper und Nähe",
    intro: "Praktiken, Safer Sex und Berührung – sachlich beschrieben, ohne Leistungsdruck.",
    slugs: ["lesben-sex", "scissoring-sexstellung", "lecktuch", "vaginale-selbsttests-dating", "lesben-massage", "ohne-slip-slipless"],
  },
  {
    heading: "Freizeit und Kultur",
    intro: "Serien für den Abend auf dem Sofa und Reiseziele, in denen Du als Paar entspannt unterwegs bist.",
    slugs: ["lesbische-serien", "reiselaender-fuer-lesben"],
  },
];

export type Hub = { heading: string; lead: string; groups: HubGroup[] };

export const HUBS: Record<string, Hub> = {
  ratgeber: {
    heading: "Ratgeber für lesbische Frauen",
    lead:
      "Die Fragen, die uns am häufigsten erreichen – nach Anliegen sortiert statt nach Datum. " +
      "Von den ersten Zweifeln an der eigenen Orientierung bis zur Beziehung, die schon ein paar Jahre hält.",
    groups: RATGEBER_GROUPS,
  },
};

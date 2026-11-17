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
    slugs: [
      "bin-ich-lesbisch",
      "coming-out",
      "outing-und-coming-out-was-ist-hinterher-versteckt",
      "spaetes-coming-out-frauen",
      "lesben-erkennen",
      "lesbentreff",
    ],
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
    slugs: ["geschlechtsidentitaet", "genderfluid", "cisgender", "intersexuell", "androgyn", "maskulin-feminin"],
  },
  {
    heading: "Szene, Symbole und Geschichte",
    intro: "Woher Flagge, Begriffe und die wirtschaftliche Bedeutung der Community kommen.",
    slugs: ["lgbt", "lesbenflagge", "rosa-geld"],
  },
  {
    heading: "Dating und Sicherheit",
    intro: "Vom Profilbild bis zum Umgang mit missbrauchten Fotos: wie Du beim Online-Dating gut ankommst und geschützt bleibst.",
    slugs: ["perfekte-profilbild", "sie-sucht-sie-ueber-50", "deepfake-gewalt-dating", "kinderwunsch-social-media-samenspende"],
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

export const TV_SHOWS_GROUPS: HubGroup[] = [
  {
    heading: "Princess Charming: alle Staffeln",
    intro:
      "Die erste lesbische Dating-Show im deutschen Fernsehen, Staffel für Staffel: Wer die Princess war, " +
      "wo gedreht wurde und wie die Staffel ausging.",
    slugs: [
      "princess-charming-2020-staffel-1",
      "princess-charming-2021-staffel-2",
      "princess-charming-2022-staffel-3",
      "princess-charming-2024-staffel-4",
      "princess-charming-2025-staffel-5",
      "princess-charming-2026-staffel-6",
    ],
  },
  {
    heading: "Weitere queere Formate",
    intro: "Shows, in denen queere Frauen nicht nur Beiwerk sind.",
    slugs: ["temptation-island-vip-2026-erstes-queeres-paar"],
  },
];

export const LIFESTYLE_GROUPS: HubGroup[] = [
  {
    heading: "Städte und Reiseziele",
    intro:
      "Wo die Szene groß genug ist, um jemanden kennenzulernen, und welche Länder als Paar entspannt sind.",
    slugs: [
      "top-10-staedte-deutschland",
      "top-10-staedte-oesterreich",
      "top-10-staedte-schweiz",
      "reiselaender-fuer-lesben",
      "go-holidate-reiseideen-fuer-lesbische-frauen",
    ],
  },
  {
    heading: "Kennenlernen, Nähe und Beziehungsmodelle",
    intro:
      "Vom ersten Kontakt auf einer Dating-Plattform bis zur Frage, wie viel Freiheit eine Beziehung verträgt.",
    slugs: [
      "offene-beziehungen-frauen",
      "partnersuche-auf-dating-plattformen",
      "lesben-massage",
      "ohne-slip-slipless",
      "8-gruende-warum-frauen-die-besseren-liebhaber-sind",
    ],
  },
  {
    heading: "Klischees im Alltag",
    intro: "Zwei Sätze, die lesbische Frauen zu oft hören – einmal nachgefragt, was davon übrig bleibt.",
    slugs: ["lange-fingernaegel", "lesbisch-ab-40"],
  },
];

export const SICHTBARKEIT_GROUPS: HubGroup[] = [
  {
    heading: "Aktionstage im Jahr",
    intro:
      "Welcher Tag wofür steht, woher er kommt und was an ihm passiert – von der Übersicht bis zum einzelnen Datum.",
    slugs: [
      "lesbische-tage",
      "csd",
      "idahobit",
      "coming-out-day",
      "lesbian-day",
      "lesbian-visibility-day",
      "tag-der-bisexualitaet",
    ],
  },
  {
    heading: "Sichtbarkeit in Film und Öffentlichkeit",
    intro: "Wo queere Frauen in großen Geschichten vorkommen – und was passiert, wenn sie dort fehlen.",
    slugs: ["eisprinzessin-elsa-lesbisch", "eigener-staat-fuer-schwule-und-lesben"],
  },
  {
    heading: "Ablehnung und ihre Folgen",
    intro: "Woher Homophobie kommt und wie sie wirkt – im Alltag und in Ländern, in denen sie Staatssache ist.",
    slugs: ["homophobe-menschen-sind-oft-selbst-homosexuell", "lesbenleben-in-aegypten"],
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
  "tv-shows": {
    heading: "Queere Dating-Shows im Fernsehen",
    lead:
      "Seit 2020 suchen Frauen auch im deutschen Fernsehen nach Frauen. Hier steht, was in jeder Staffel " +
      "Princess Charming passiert ist – und welche anderen Formate queere Paare zeigen, statt sie nur zu erwähnen.",
    groups: TV_SHOWS_GROUPS,
  },
  lifestyle: {
    heading: "Lesbischer Alltag: Städte, Reisen und Klischees",
    lead:
      "Wo es sich als lesbische Frau gut leben lässt, welche Reiseziele entspannt sind, was in einer Beziehung " +
      "zwischen zwei Frauen verhandelt wird – und was von den alten Klischees übrig bleibt.",
    groups: LIFESTYLE_GROUPS,
  },
  sichtbarkeit: {
    heading: "Queere Sichtbarkeit: Aktionstage, Filme, Gegenwind",
    lead:
      "Ein Jahr voller Tage, an denen queeres Leben sichtbar wird – vom CSD bis zum Coming-out-Day. Dazu die Frage, "
      + "wo lesbische Frauen in großen Geschichten vorkommen und wo Sichtbarkeit bis heute gefährlich ist.",
    groups: SICHTBARKEIT_GROUPS,
  },
};

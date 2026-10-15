// Gleicher Linktext soll immer auf dasselbe Ziel zeigen (Seobility „identische Linktexte, unterschiedliche Ziele“, Crawl 14.10.2026).
// Sichtbarer Text bleibt wo möglich; sonst bekommt der Link einen eindeutigen Zusatz oder fällt als Fließtext weg.

const unlink = (href, text) => [new RegExp(`<a href="${href}/?">${text}</a>`, "g"), text];

const ENTRY_FIXES = {
  // Falsches Ziel im Import: Leipzig zeigte auf den Hamburg-Guide.
  "lesben-staedte-szene": [[/href="\/magazin\/lesbische-szenebars-in-hamburg\/?">Leipzig</g, 'href="/magazin/lesbische-szenebars-in-leipzig">Leipzig<']],
  // Inhaltlich unpassende Ziele, die mit Hauptnavigation bzw. Städteseiten konkurrieren.
  "vaginale-selbsttests-dating": [unlink("/magazin/deepfake-gewalt-dating", "Datenschutz")],
  "24-02-17-der-tribas-club-in-frankfurt": [unlink("/magazin/swag-lesbenparty-mai-2017", "Frankfurt")],
  "buchvorstellung-die-dritte": [unlink("/magazin/top-10-staedte-deutschland", "Hannover")],
  // Autorinnennamen verlinken überall (Über uns, Autorenbox) das Beitragsarchiv.
  redaktion: [
    [/href="\/magazin\/alicia\/?">Alicia Schlienz</g, 'href="/magazin/author/lesbischeliebe">Alicia Schlienz<'],
    [/href="\/magazin\/christian-m-haas\/?">Christian M\. Haas</g, 'href="/magazin/author/christian-m-haas">Christian M. Haas<'],
  ],
  // Glossarbegriff heißt wie die Lexikonseite, nicht wie die Städte-Partnersuche im Footer.
  glossar: [[/(href="\/lexikon\/partnersuche-im-internet\/?">)Partnersuche</g, "$1Partnersuche im Internet<"]],
};

const PAGE_FIXES = {
  // CTA wie auf allen anderen Stadtseiten zur Registrierung statt zurück zur Übersicht.
  "/partnersuche/freiburg": [[/href="\/partnersuche\/?">Jetzt kostenfrei anmelden</g, 'href="https://www.sie-sucht-sie.de/registration/?AID=location">Jetzt kostenfrei anmelden<']],
  "/faq": [[/sowie direkt auf <a href="\/bewertungen-und-erfahrungen\/?">sie-sucht-sie\.de<\/a>/g, 'sowie direkt in unseren <a href="/bewertungen-und-erfahrungen">Bewertungen auf sie-sucht-sie.de</a>']],
};

// Für alle Inhalte: Themenbegriffe mit einem festen Ziel, Stadt-Anker der Bar-Guides mit Themenzusatz
// (bloße Stadtnamen verlinken auf die Städteseiten unter /partnersuche/).
const SHARED_FIXES = [
  [/href="\/magazin\/(?:lesben-sex|lesben-erkennen)\/?">Lesben</g, 'href="/magazin/lesbisch">Lesben<'],
  [/href="\/magazin\/lesbische-beziehung\/?">Beziehung</g, 'href="/lexikon/fuer-beziehung">Beziehung<'],
  [/href="\/magazin\/tag-der-bisexualitaet\/?">bisexuelle Frauen</g, 'href="/magazin/bisexuell-darum-ist-jede-frau-etwas-bi">bisexuelle Frauen<'],
  [/href="\/magazin\/princess-charming-20\d\d-staffel-\d\/?">Princess Charming</g, 'href="/magazin/princess-charming-2026-staffel-6">Princess Charming<'],
  [/(<a href="\/magazin\/(?:lesbische-szenebars|lesbenbars)-in-[a-z-]+\/?">)(<strong>)?([A-ZÄÖÜ][a-zäöüß]+(?:[ -][A-ZÄÖÜa-zäöüß]+)*)(<\/strong>)?<\/a>/g, "$1$2Lesbenbars in $3$4</a>"],
];

function apply(html, fixes) {
  let out = html;
  for (const [pattern, replacement] of fixes) out = out.replace(pattern, replacement);
  return out;
}

export function withUniqueEntryLinks(slug, html) {
  return apply(apply(html, ENTRY_FIXES[slug] ?? []), SHARED_FIXES);
}

export function withUniquePageLinks(path, html) {
  return apply(apply(html, PAGE_FIXES[path] ?? []), SHARED_FIXES);
}

// Redaktionelle Hinweise für einzelne Stadtseiten (nur die hier genannten Pfade, nie für alle Städte).
// Steht im Guide nach dem letzten Kapitel und vor dem eingeklappten Quellenblock.
const CITY_NOTES = Object.freeze({
  "/partnersuche/kassel": Object.freeze({
    before: "Ihr sollt nicht nur die Liebe zu Frauen teilen? Das ",
    anchor: "Quiz für Kasseler Singles",
    href: "https://kasseler-singles.de/#quiz",
    after: " auf kasseler-singles.de zeigt dir in drei Fragen passende Nischenbörsen in Kassel.",
  }),
});

export function cityNoteFor(path = "") {
  return CITY_NOTES[path.replace(/\/+$/, "")] ?? null;
}

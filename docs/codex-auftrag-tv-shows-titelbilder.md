# Codex-Auftrag: einheitliche Titelbilder für die Kategorie TV-Shows

Projekt: `sie-sucht-sie` (Next.js, Vercel). Die Kategorie TV-Shows hat sieben Beiträge, deren Titelbilder aus vier verschiedenen Welten stammen: zwei pastellige Stockfotos von 2023, ein helles Pink-Studiofoto, ein modernes WebP und drei KI-Plakate von Juli 2026. Die Kategorieseite wirkt dadurch zusammengewürfelt.

**Die drei KI-Plakate sind bereits entfernt** (Dateien, Assets und Attachment-Seiten; die Beiträge zeigen derzeit den Verlaufs-Platzhalter). Grund steht unten unter „Was nicht wieder passieren darf“. Gebraucht wird ein Satz, der für alle sieben Beiträge funktioniert.

## Gemeinsame Bildsprache

Alle sieben Bilder gehören sichtbar zusammen:

- Format 1200 × 675 px, WebP, höchstens 180 KB je Bild.
- Dunkler Hintergrund in der Markenwelt der Seite (Pflaume/Magenta, `#3b0a2a` bis `#b32767`), warmes Licht, ein einzelner Akzent in Gold oder Rosé.
- Ein Motiv pro Bild, ruhig und grafisch: Fernsehstudio-Licht, Rosen, Sitzgruppe am Pool im Abendlicht, Scheinwerfer, Kamerakran, Sektgläser. Menschen dürfen vorkommen, aber nur unscharf oder angeschnitten, nie als erkennbare Person.
- Gleicher Bildausschnitt und gleiche Lichtrichtung über alle sieben, damit sie als Kacheln nebeneinander funktionieren.
- Kein Text im Bild. Keine Krone als Hauptmotiv (sie ist das Zeichen des Formats, nicht unseres).

## Die sieben Beiträge

| Beitrag | Slug | Bisher | Zielpfad |
| --- | --- | --- | --- |
| Princess Charming – 2020 – Staffel 1 | `princess-charming-2020-staffel-1` | Stockfoto Flamingos, 969 KB | `public/magazine/media/tv-princess-charming-staffel-1.webp` |
| Princess Charming – 2021 – Staffel 2 | `princess-charming-2021-staffel-2` | Stockfoto, 926 KB | `tv-princess-charming-staffel-2.webp` |
| Princess Charming – 2022 – Staffel 3 | `princess-charming-2022-staffel-3` | Pink-Studiofoto | `tv-princess-charming-staffel-3.webp` |
| Princess Charming – 2024 – Staffel 4 | `princess-charming-2024-staffel-4` | entfernt | `tv-princess-charming-staffel-4.webp` |
| Princess Charming – 2025 – Staffel 5 | `princess-charming-2025-staffel-5` | entfernt | `tv-princess-charming-staffel-5.webp` |
| Princess Charming – 2026 – Staffel 6 | `princess-charming-2026-staffel-6` | entfernt | `tv-princess-charming-staffel-6.webp` |
| Erstes queeres Paar bei Temptation Island VIP 2026 | `temptation-island-vip-2026-erstes-queeres-paar` | WebP, passt farblich schon | `tv-temptation-island-vip-2026.webp` |

Die sechs Staffelbilder dürfen sich unterscheiden (Drehort, Jahreszeit, Lichtfarbe), müssen aber als Reihe erkennbar bleiben. Das vorhandene Temptation-Island-Bild kann bleiben, wenn es farblich zum neuen Satz passt; sonst mit erneuern.

Alt-Text je Bild: was zu sehen ist, plus Staffel, zum Beispiel „Abendliche Poolterrasse mit Rosen, Titelbild zu Princess Charming Staffel 4“. Deutsch, kein Englisch.

## Was nicht wieder passieren darf

Die drei entfernten Bilder waren KI-erzeugte Werbeplakate für eine echte Fernsehsendung:

- `4415` trug die Zeile „VANESSA BORCK präsentiert“ mit erfundenem Claim „LIEBE. ECHT. ICH.“ und der erfundenen Wortmarke „NESSIONTOUR THAILAND“. Vanessa Borck ist eine reale Person; das Bild sah aus wie offizielles Material der Produktion, war aber vollständig erfunden.
- `4417` zeigte „PRINCESS CHARMING 2026 – STAFFEL 6 – COMING SOON“ in Goldtypografie wie eine Ankündigung des Senders.
- `4413` war als „promotional cover“ anlegt, Alt-Text auf Englisch.

Deshalb: keine Schriftzüge, keine Wortmarken, keine Claims, keine Namen realer Personen, nichts, was als offizielles Material eines Senders oder einer Produktion gelesen werden kann. Unsere Titelbilder illustrieren unseren Artikel über die Sendung – sie geben nicht vor, die Sendung zu sein.

## Nach dem Einbinden

- Je Bild ein Eintrag in `assets` in `data/magazine.json` (`id`, `localPath`, `mimeType`, `bytes`, `sha256`, `alt`, `legacyPaths`) und als `featuredImage` am jeweiligen Beitrag; `tests/magazine.test.mjs` prüft beide Richtungen.
- `node scripts/magazine-media-sizes.mjs` laufen lassen.
- `npm test`, `npm run lint`, `npm run typecheck` und `npm run build` müssen grün bleiben.
- Kein `<img>` ohne `alt`.
- Ergebnis als Kommentar in der Trello-Karte melden.

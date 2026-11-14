# Codex-Auftrag: Titelbilder und Infografik für die neue Nachtleben-Rubrik

Projekt: `sie-sucht-sie` (Next.js, Vercel). Die Kategorie Nachtleben wurde am 14.11.2026 neu aufgesetzt: Vier Einzeltermine von 2017 sind ausgemustert, zwei Evergreen-Beiträge sind live. Beiden fehlt noch das Titelbild, dem Festival-Artikel zusätzlich eine Infografik.

## 1. Titelbild „Lesbische Festivals und Frauenpartys“

- Artikel: <https://www.sie-sucht-sie.de/magazin/lesbische-festivals/>
- Zielpfad: `public/magazine/media/4501-lesbische-festivals.jpg`
- Eintragen als `featuredImage` des Eintrags mit `"id": 4501` in `data/magazine.json`
- Format: 1200 × 675 px, JPG, unter 300 KB
- Motiv: Festivalstimmung unter freiem Himmel, Frauen beim Feiern, warmes Abendlicht, Lichterketten oder Bühne im Hintergrund. Keine Logos realer Festivals, keine erkennbaren Markenzeichen, keine Regenbogenflagge als einziges Motiv.
- Farbwelt an die Seite angleichen (Pink/Magenta, dunkler Hintergrund), siehe bestehende Beitragsbilder im Magazin.
- Alt-Text: „Frauen feiern bei Abendlicht auf einem Open-Air-Festival“

## 2. Titelbild „Das erste Mal auf einer Lesben-Party“

- Artikel: <https://www.sie-sucht-sie.de/magazin/erste-lesben-party/>
- Zielpfad: `public/magazine/media/4502-erste-lesben-party.jpg`
- Eintragen als `featuredImage` des Eintrags mit `"id": 4502`
- Format: 1200 × 675 px, JPG, unter 300 KB
- Motiv: Barsituation am frühen Abend, zwei Frauen im Gespräch an einem Tresen, ruhig und einladend statt Clubgedränge. Keine Alkoholwerbung, keine Markenflaschen im Bild.
- Alt-Text: „Zwei Frauen im Gespräch an einem Bartresen am frühen Abend“

## 3. Infografik „Das Szenejahr“ (Pflicht)

- Zielpfad: `public/magazine/media/4503-szenejahr-lesbische-festivals.png`
- Einbindung: im Artikel `lesbische-festivals` direkt nach dem Abschnitt „Das Szenejahr auf einen Blick“ (erste `<ul>` im Beitrag), als `<figure>` mit `<figcaption>`
- Format: PNG, 1200 px breit, lesbar auch auf 375 px Breite (Mobile zuerst prüfen)
- Darstellung: Zeitstrahl Mai bis Oktober, je Monat die Veranstaltungen als Punkte. Keine Tabelle.
- Alt-Text: „Zeitstrahl von Mai bis Oktober mit den wiederkehrenden Festivals für lesbische und queere Frauen“
- Bildunterschrift: „Das Szenejahr im Überblick. Stand November 2026, Termine künftiger Ausgaben können sich ändern.“

### Belegte Inhalte für den Zeitstrahl

Alle Angaben stammen aus den im Artikel verlinkten Quellen (Stand November 2026). Nichts ergänzen, was dort nicht steht.

| Monat | Veranstaltung | Beleg |
| --- | --- | --- |
| Mai (Pfingsten) | Lesbenfrühlingstreffen, 2026 vom 22.–25.5. am Werbellinsee, seit 1974 | lft2026.de, L-Mag |
| Mai | Queer Ranch Festival (Lesbos) 18.–23.5.2026; Velvet Ibiza 21.–25.5.2026; Fulanita (Fuengirola) 25.–31.5.2026 | L-Mag-Festivalübersicht 2026 |
| Juni | Zurich Pride (2027: 11./12.6.); Regenbogenparade Wien (Juni 2027, 31. Ausgabe) | zurichpridefestival.ch, wien.info |
| Juli | ColognePride (2027: Straßenfest 2.–4.7., Demo 4.7.); Dyke* March Berlin 24.7.2026; Dyke* March Hamburg 31.7.2026; Out & Wild 3.–6.7.2026; Unity Fest 10.–13.7.2026 | colognepride.de, tip Berlin, L-Mag |
| Juli/August | Femø Women's Camp, International Week 25.7.–1.8.2026, Camp seit 1971 | L-Mag |
| August | Dyke* Festival Berlin 22./23.8.2026; Pink Lake 24.–30.8.2026; ELLA Mallorca 27.8.–4.9.2026 | ZK/U Berlin, OTS/woerthersee.com, L-Mag |
| September | Oban Lesbian+ Weekend 3.–7.9.2026; Sappho Women (Lesbos) 9.–19.9.2026 | L-Mag |
| Oktober | The Dinah (Palm Springs) 30.9.–4.10.2026 | L-Mag |

Hinweis für die Grafik: Pride-Veranstaltungen und Pink Lake richten sich an die gesamte Community, die übrigen Formate an Frauen. Diese Unterscheidung bitte sichtbar machen, zum Beispiel über zwei Punktfarben mit Legende.

## Nach dem Einbinden

- Jedes neue Bild braucht einen Eintrag in `assets` in `data/magazine.json` (`id`, `localPath`, `mimeType`, `bytes`, `sha256`, `alt`, `legacyPaths`) **und** eine Referenz im Beitrag beziehungsweise als `featuredImage`; `tests/magazine.test.mjs` prüft beide Richtungen. Danach `node scripts/magazine-media-sizes.mjs` laufen lassen, sonst fehlen die Bildmaße im WP-REST-Endpunkt.
- `npm test`, `npm run lint` und `npm run build` müssen grün bleiben.
- Kein `<img>` ohne `alt`.
- Ergebnis als Kommentar in der Trello-Karte melden.

# Codex-Auftrag: Titelbilder und Infografik für die Kategorie Sichtbarkeit

Projekt: `sie-sucht-sie` (Next.js, Vercel). Die Kategorie **Sichtbarkeit** ist seit dem 18.11.2026 neu
(`/magazin/kategorie/sichtbarkeit/`, elf Beiträge, drei Themenfelder). Sieben davon sind Aktionstage, und ihre
Titelbilder stammen alle aus derselben Freepik-Sitzung vom 18.9.2024 – als Screenshots, nicht als Downloads.
Auf der Hub-Seite liegen sie direkt nebeneinander und beißen sich sichtbar: ein warmes Gegenlicht-Porträt neben
einem flachen Studiofoto auf Cyan neben einer grünen Parkszene. Zwei weitere Beiträge der Kategorie haben gar
kein Titelbild und zeigen den Verlaufs-Platzhalter.

Gebraucht wird ein Satz aus neun Bildern, der die Kategorie als Reihe trägt, plus eine Infografik zum
Jahresüberblick.

## Gemeinsame Bildsprache

Alle neun Bilder gehören sichtbar zusammen:

- Format 1200 × 675 px, WebP, höchstens 180 KB je Bild.
- Grundton aus dem Designsystem „Sunset" (`app/theme.css`): dunkles Pflaume `#3b1240` bis `#220a27` als Fond,
  darauf die Sunset-Linie Koralle `#ff8a5c` → Rosa `#f4587a` → Magenta `#d6337a` → Violett `#8e4bc6`.
- Regenbogenfarben dürfen vorkommen – sie sind bei Aktionstagen das Thema –, aber als Akzent im dunklen Bild,
  nicht als flächiger Fahnen-Scan. Ein Motiv pro Bild, ruhig und grafisch: Lichterkette über einer Straße,
  Fahnenstoff im Abendwind, Hand mit Armband, Kerzen, Konfetti auf nassem Asphalt, leere Bühne nach der Demo.
- Menschen dürfen vorkommen, aber nur unscharf, angeschnitten oder von hinten, nie als erkennbare Person.
- Gleicher Bildausschnitt und gleiche Lichtrichtung über alle neun, damit sie als Kacheln funktionieren.
- Kein Text im Bild, keine Wortmarken, keine Jahreszahlen, keine Logos von Organisationen oder Städten.

## Die neun Beiträge

| Beitrag | Slug | Bisher | Zielpfad (`public/magazine/media/`) |
| --- | --- | --- | --- |
| Wichtige LGBTQ+ Tage im Jahr | `lesbische-tage` | `3838-women-celebrating-pride-day.jpg`, 694 KB | `sichtbarkeit-lgbtq-tage.webp` |
| Christopher Street Day | `csd` | `3845-…-freepik-com.jpg`, Gegenlicht-Porträt | `sichtbarkeit-csd.webp` |
| IDAHOBIT | `idahobit` | `3848-…-freepik-com.jpg`, küssendes Paar im Park | `sichtbarkeit-idahobit.webp` |
| International Coming Out Day | `coming-out-day` | `3842-…-freepik-com.jpg` | `sichtbarkeit-coming-out-day.webp` |
| International Lesbian Day | `lesbian-day` | `3846-…-freepik-com.jpg`, Studiofoto auf Cyan | `sichtbarkeit-lesbian-day.webp` |
| Lesbian Visibility Day | `lesbian-visibility-day` | `3847-…-freepik-com.jpg` | `sichtbarkeit-lesbian-visibility-day.webp` |
| Bisexual Visibility Day | `tag-der-bisexualitaet` | `3844-…-freepik-com.jpg` | `sichtbarkeit-bi-visibility-day.webp` |
| Ein eigener Staat für Schwule und Lesben | `eigener-staat-fuer-schwule-und-lesben` | **kein Titelbild** | `sichtbarkeit-eigener-staat.webp` |
| Homophobe Menschen sind oft selbst homosexuell | `homophobe-menschen-sind-oft-selbst-homosexuell` | **kein Titelbild** | `sichtbarkeit-homophobie.webp` |

Die sieben Aktionstage dürfen sich im Motiv unterscheiden (Tageszeit, Ort, Gegenstand), müssen aber als Reihe
erkennbar bleiben. Die beiden letzten Beiträge sind keine Aktionstage: zurückhaltender, ohne Feierstimmung –
für `eigener-staat` etwa eine Landkarte im Streiflicht, für `homophobie` eine abweisende Fassade im Abendlicht.

Nicht anfassen: `eisprinzessin-elsa-lesbisch` und `lesbenleben-in-aegypten` behalten ihre themengebundenen
Bilder.

## Alt-Texte neu schreiben

Die bestehenden Alt-Texte sind nur Themenetiketten („CSD/Christopher Street Day", „Lesbian Day",
„Tag der Bisexualität"). Das ist kein Alt-Text. Jedes neue Bild bekommt eine Beschreibung dessen, was zu sehen
ist, plus den Anlass – deutsch, kein Englisch, zum Beispiel: „Regenbogenfarbene Lichterkette über einer
abendlichen Straße, Titelbild zum Christopher Street Day".

## Infografik: die Aktionstage im Jahreslauf

Zusätzlich eine Infografik für `lesbische-tage` – der Artikel zählt neun Termine in Fließtext auf, das ist als
Jahresüberblick unbrauchbar.

- Zielpfad `public/magazine/media/sichtbarkeit-aktionstage-jahreslauf.webp`, 1200 × ca. 900 px, WebP,
  höchstens 200 KB. Querachse = Jahr von Januar bis Dezember, die Termine als Punkte auf der Zeitachse.
- Einbinden im Artikel `lesbische-tage` direkt **nach** dem Einleitungsabsatz und vor
  „Lesbian Visibility Day – 26. April", als `<figure>` mit `loading="lazy"`.
- Farben wie oben, Schrift lesbar ab 320 px Breite (die Grafik wird auf dem Handy skaliert).

Diese Termine stehen im Artikel und gehören in die Grafik:

| Termin | Tag |
| --- | --- |
| Lesbian Visibility Day | 26. April |
| IDAHOBIT | 17. Mai |
| Christopher Street Day | wechselnde Daten, Bezug: Stonewall ab 28. Juni 1969 |
| Bisexual Visibility Day | 23. September |
| International Lesbian Day | 8. Oktober |
| International Coming Out Day | 11. Oktober |
| Intersex Awareness Day | 26. Oktober |
| Asexual Awareness Week | letzte Oktoberwoche |
| Transgender Day of Remembrance | 20. November |

**Jedes Datum vor dem Zeichnen gegen eine offizielle Quelle prüfen** (may17.org für IDAHOBIT,
bivisibilityday.com, HRC für den Coming Out Day, interactadvocates.org, GLAAD für den TDoR) und die geprüften
Quellen unten im Quellenblock des Artikels ergänzen – als `<p><em><strong>Quellen:</strong></em></p>` plus
`<ul>`, das Rendering klappt sie automatisch ein. Stimmt ein Datum nicht mit dem Artikeltext überein, nicht
still korrigieren, sondern in der Trello-Karte melden.

Der CSD hat kein festes Datum. In der Grafik als Band über Juni/Juli darstellen, nicht als Punkt, und in der
Legende kenntlich machen.

## Nach dem Einbinden

- Je Bild ein Eintrag in `assets` in `data/magazine.json` (`id`, `localPath`, `mimeType`, `bytes`, `sha256`,
  `alt`, `legacyPaths`) und als `featuredImage` am jeweiligen Beitrag; `tests/magazine.test.mjs` prüft beide
  Richtungen. Die alten Freepik-Dateien samt Assets und Attachment-Seiten entfernen und die bisherigen Pfade
  als `legacyPaths` am neuen Asset führen, damit alte Bild-URLs nicht ins Leere laufen.
- `node scripts/magazine-media-sizes.mjs` laufen lassen.
- `npm test`, `npm run lint`, `npm run typecheck` und `npm run build` müssen grün bleiben.
- Kein `<img>` ohne `alt`.
- Achtung Re-Import: Die Kategorie `sichtbarkeit` (id 253) gibt es nur in `data/magazine.json`, nicht in
  WordPress. `scripts/import_magazine.py` würde sie entfernen – nicht neu importieren, nur die Datei ändern.
- Ergebnis als Kommentar in der Trello-Karte melden.

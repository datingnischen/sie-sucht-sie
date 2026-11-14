# Sie-sucht-Sie.de – Next.js/Vercel Migration

Die öffentliche Vercel-Ebene für Sie-sucht-Sie.de. Das Projekt bewahrt die Markenidentität und SEO-Routen der Live-Seite, während Login, Registrierung, Suche, Hilfe und rechtliche Seiten weiterhin auf der bestehenden ICONY-Plattform liegen. Das öffentliche WordPress-Magazin wird als geprüfter statischer Snapshot ausgeliefert.

## Lokal starten

```bash
npm install
npm test
npm run dev
```

## Qualitätsprüfungen

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Inhaltsimport

`scripts/import_public_pages.py` erzeugt aus der öffentlichen `sitemap.php` einen deterministischen redaktionellen Snapshot in `data/pages.json`. `scripts/import_magazine.py` übernimmt veröffentlichte WordPress-Beiträge, Seiten, Bylines, Kategorien und die benötigten Magazinmedien nach `data/magazine.json` und `public/magazine/media/` und stellt danach die Magazinlinks in `data/pages.json` auf die migrierten Routen um. Dynamische Mitgliederprofile, Formulare, Skripte, Embeds und personalisierte Inhalte werden nicht gespeichert.

Reihenfolge beachten – der Magazinimport muss nach dem Seitenimport laufen:

```bash
python scripts/import_public_pages.py
python scripts/import_magazine.py
```

## Migrationsgrenzen

- Öffentliche redaktionelle Routen und regionale Einstiege rendert Next.js.
- Login, Registrierung, Suche, Hilfe und rechtliche Seiten bleiben auf `https://www.sie-sucht-sie.de`.
- Standortseiten verwenden `AID=location`.
- Andere redaktionelle Oberflächen verwenden `AID=magazin`.
- Das öffentliche Magazin unter `/magazin` rendert Next.js aus `data/magazine.json`. WordPress-Admin, REST-API, Suche, Kommentare und Schlagwort-Archive werden nicht nachgebaut.
- Die WordPress-Quelle umfasst 439 Beiträge, 18 Seiten und 386 Medien. Übernommen werden 85 redaktionelle Beiträge, 16 Seiten und 135 tatsächlich eingebundene Medien.
- Die 354 Kontaktanzeigen (Kategorie „Kontaktanzeigen“, 2016–2019) enthalten Namen, Alter, Regionen und private Facebook-Profile von Nutzerinnen. Sie werden bewusst nicht übernommen; ihre URLs sowie die Seiten `kontaktanzeigen-bundeslaender` und `archiv` leiten per 308 auf `/magazin` weiter. Schlagwort-, Datums- und Seitenarchive leiten ebenfalls auf `/magazin`.
- Ein Lesarion-Screenshot mit fremden Mitglieder-Nicknames (Medien-ID 3678) ist ausgeschlossen.
- Attachment-Seiten leiten zum zugehörigen Beitrag oder Medium weiter; alte `wp-content/uploads`-URLs leiten auf die lokalisierten Dateien weiter.

### Pflicht vor dem Domain-Cutover

Solange `www.sie-sucht-sie.de` noch auf ICONY zeigt, funktionieren die absoluten Plattformlinks. **Vor einem DNS-Cutover auf Vercel muss jedoch ein separater, von Vercel erreichbarer Legacy-Origin festgelegt und für Registrierung, Login, Suche, Hilfe, Kontakt, Legal sowie benötigte WordPress-Admin-/API-Pfade per Proxy/Rewrites angebunden werden.** Ohne diesen Origin darf die Hauptdomain nicht auf Vercel umgestellt werden, weil diese Pfade sonst 404 liefern oder in eine Schleife geraten.

## Zeitstempel im Magazin

`date`/`modified` erscheinen in JSON-LD, Sitemap und `/magazin/wp-json`. Nie runde Uhrzeiten, nie dieselbe Sekunde oder denselben Aktualisierungstag für viele Beiträge, höchstens zwei Beiträge je Erscheinungstag. Für Überarbeitungen im Code `naturalStamp(tag, pfad)` aus `lib/natural-time.mjs` nutzen. `tests/magazine-timestamps.test.mjs` sperrt Verstöße.

## Nachtleben: keine Einzeltermine

Die Kategorie `nachtleben` enthält keine Ankündigungen einzelner Partys oder Festivaltermine mehr. Vier Beiträge von 2017 (Tribas-Party, Pink Lake 2017, S.W.A.G, WomenSummerLand) sind ausgemustert und leiten per 308 auf den Nachtleben-Hub `/magazin/kategorie/nachtleben/`; ihre Attachment-Seiten, Medien und Audio-Zusammenfassungen wurden entfernt. Die Zähler dazu stehen in `sourceCounts` (`retiredEventPosts`, `retiredEventAttachments`, `retiredEventAssets`), `tests/magazine.test.mjs` prüft sie.

Neue Beiträge zum Thema beschreiben den wiederkehrenden Jahresrhythmus (Monat, Reihe, Veranstalter) statt eines Datums, nennen den Stand im Quellenblock und werden einmal jährlich geprüft. Einzeltermine veralten sonst still weiter, während Sammel-Aktualisierungen ein frisches „Aktualisiert am“ darüberlegen.

Die Kategorieseite `nachtleben` ist der Hub: eigener Titel, Hero, Städteliste und Infografik in `app/magazin/kategorie/[slug]/page.tsx`. Indexierbar ist eine Kategorie nur, wenn sie in `data/magazine.json` eine eigene `description` hat (derzeit `nachtleben`, `lesbenportale` und `ratgeber`); reine Beitragslisten bleiben `noindex, follow`. `tests/magazine.test.mjs` prüft die Regel samt Mindestlänge der Beschreibung, Mindestzahl an Beiträgen und eigenem Seitentitel.

## Kategorie-Hubs mit Themengruppen

Kategorien mit vielen Beiträgen sind als Datumsliste unbrauchbar. Für sie steht in `lib/magazine-hubs.ts` ein Hub: Überschrift, Einleitung und Themengruppen mit den Slugs der Beiträge; `app/magazin/kategorie/[slug]/page.tsx` rendert daraus Hero, Gruppenkarten (`components/magazine/hub-groups.tsx`) und darunter die drei neuesten Beiträge. Verlinkt ist nur der Beitragstitel, und die Titel kommen aus `data/magazine.json`, damit Hub und Artikel nicht auseinanderlaufen.

`tests/magazine.test.mjs` prüft, dass jeder Beitrag der Kategorie in genau einer Gruppe steht und keine Gruppe auf fremde Beiträge zeigt. Ein neuer Ratgeber-Beitrag lässt den Test also fehlschlagen, bis er einer Gruppe zugeordnet ist – das hält den Hub vollständig, ohne dass jemand daran denken muss.

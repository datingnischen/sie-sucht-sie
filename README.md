# Sie-sucht-Sie.de – Next.js/Vercel Migration

Die öffentliche Vercel-Ebene für Sie-sucht-Sie.de. Das Projekt bewahrt die Markenidentität und SEO-Routen der Live-Seite, während Login, Registrierung, Suche, Hilfe und rechtliche Seiten weiterhin auf der bestehenden ICONY-Plattform liegen.

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

`scripts/import_public_pages.py` erzeugt aus der öffentlichen `sitemap.php` einen deterministischen redaktionellen Snapshot in `data/pages.json`. Dynamische Mitgliederprofile, Formulare und personalisierte Inhalte werden nicht gespeichert.

```bash
python scripts/import_public_pages.py
```

## Migrationsgrenzen

- Öffentliche redaktionelle Routen und regionale Einstiege rendert Next.js.
- Login, Registrierung, Suche, Hilfe und rechtliche Seiten bleiben auf `https://www.sie-sucht-sie.de`.
- Standortseiten verwenden `AID=location`.
- Andere redaktionelle Oberflächen verwenden `AID=magazin`.
- Das WordPress-Magazin bleibt zunächst auf `/magazin/` als bestehendes Quellsystem erreichbar.

### Pflicht vor dem Domain-Cutover

Solange `www.sie-sucht-sie.de` noch auf ICONY zeigt, funktionieren die absoluten Plattform- und Magazinlinks. **Vor einem DNS-Cutover auf Vercel muss jedoch ein separater, von Vercel erreichbarer Legacy-Origin festgelegt und für Registrierung, Login, Suche, Hilfe, Kontakt, Legal und Magazin per Proxy/Rewrites angebunden werden.** Ohne diesen Origin darf die Hauptdomain nicht auf Vercel umgestellt werden, weil diese Pfade sonst 404 liefern oder in eine Schleife geraten.

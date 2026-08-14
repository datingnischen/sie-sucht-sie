export const dynamic = "force-static";

const content = `# Sie-sucht-Sie.de

> Deutschsprachige Singlebörse und redaktionelles Informationsangebot für lesbische und bisexuelle Frauen.

Canonical: https://www.sie-sucht-sie.de/
Sitemap: https://www.sie-sucht-sie.de/sitemap.xml
Language: de-DE

## Öffentliche Inhaltsbereiche

- [Partnersuche in Deutschland](https://www.sie-sucht-sie.de/partnersuche): Regionale Einstiege und deutsche Städte.
- [Österreich](https://www.sie-sucht-sie.de/oesterreich): Regionale Einstiege für Österreich.
- [Schweiz](https://www.sie-sucht-sie.de/schweiz): Regionale Einstiege für die Schweiz.
- [Lexikon](https://www.sie-sucht-sie.de/lexikon): Begriffe rund um lesbisches Dating, Beziehungen und Community.

## Plattformgrenze

Registrierung, Login, Suche, Hilfe und rechtliche Seiten bleiben Plattformfunktionen auf der Canonical-Domain. Die Sitemap enthält die öffentlich migrierten redaktionellen Seiten.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

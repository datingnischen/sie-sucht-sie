import type { Metadata } from "next";
import Link from "next/link";
import { getFamilyPages } from "@/lib/content";
import { locationName, platform, registrationUrl, SITE_URL } from "@/lib/site";
import { buildPageEntityGraph, serializePageEntityGraph } from "@/lib/page-entities.mjs";
import { staticAsset } from "@/lib/static-asset.mjs";

export const metadata: Metadata = {
  title: "Sie sucht Sie – Die Singlebörse für Frauen, die Frauen lieben",
  description: "Kostenlos registrieren, Frauen aus Deiner Region kennenlernen und mit Sicherheit, Herz und über 20 Jahren Dating-Erfahrung in die Partnersuche starten.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { images: [staticAsset("/home/hero.webp")] },
};

const trust = [
  ["♡", "Sicher kennenlernen", "Server in Deutschland und sorgfältige Profilprüfung schaffen einen geschützten Einstieg.", platform.safety],
  ["✓", "Redaktionelle Kontrolle", "Unser Supportteam prüft neue Profile und geht konsequent gegen auffällige Accounts vor.", platform.editorialControl],
  ["0 €", "Kostenlos starten", "Registrierung, Profil und viele Kontaktmöglichkeiten stehen bereits in der Basis-Mitgliedschaft offen.", platform.basicMembership],
] as const;

export default function HomePage() {
  const cities = getFamilyPages("partnersuche").slice(0, 8);
  const pageEntityGraph = buildPageEntityGraph({
    path: "/",
    canonical: `${SITE_URL}/`,
    type: "editorial",
    h1: "Finde eine Partnerin, die wirklich zu Dir passt.",
    description: metadata.description,
  });
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializePageEntityGraph(pageEntityGraph) }} />
    <section className="hero wrap">
      <img className="hero-image" src={staticAsset("/home/hero.webp")} alt="Zwei glückliche Frauen in einer liebevollen Begegnung" width="1170" height="659" />
      <div className="hero-card"><p className="kicker">Frauen kennenlernen</p><h1>Finde eine Partnerin, die wirklich zu Dir passt.</h1><p>Ob große Liebe, ehrliche Gespräche oder neue Kontakte: Bei Sie-sucht-Sie.de begegnest Du Frauen, die Frauen lieben – direkt in Deiner Region.</p><a className="button button-green" href={registrationUrl("/")}>Kostenlos registrieren</a><ul className="hero-trust"><li>Über 20 Jahre Erfahrung</li><li>Server in Deutschland</li><li>Keine versteckten Kosten</li></ul></div>
    </section>

    <section className="wrap section"><div className="section-heading"><p className="kicker">Sicher. Persönlich. Auf Augenhöhe.</p><h2>Ein guter Anfang braucht Vertrauen</h2></div><div className="trust-grid">{trust.map(([icon,title,text,href]) => <a className="trust-card" href={href} key={title}><span className="trust-icon">{icon}</span><h3>{title}</h3><p>{text}</p><span className="text-link">Mehr erfahren →</span></a>)}</div></section>

    <section className="wrap feature feature-light"><img src={staticAsset("/home/fragenflirt.webp")} alt="Strand oder Berge – spielerisch Gemeinsamkeiten entdecken" width="361" height="311" /><div><p className="kicker">Fragenflirt</p><h2>Strand oder Berge?</h2><p>Entdeckt spielerisch, ob Eure Wünsche, Werte und Träume zusammenpassen. So entsteht ein Gespräch, das gleich ein bisschen persönlicher ist.</p><a className="text-link" href={`${SITE_URL}/fragenflirt.html`}>Fragenflirt entdecken →</a></div></section>
    <section className="wrap feature feature-dark"><div><p className="kicker">Fotoflirt</p><h2>Manchmal beginnt ein Flirt mit einem Blick.</h2><p>Wenn die richtigen Worte noch fehlen, hilft der Fotoflirt beim unkomplizierten ersten Kennenlernen.</p><a className="text-link light" href={`${SITE_URL}/fotoflirt.html`}>Fotoflirt ausprobieren →</a></div><img src={staticAsset("/home/fotoflirt.webp")} alt="Fotoflirt mit Profilbildern von Frauen" width="449" height="275" /></section>

    <section className="wrap section"><div className="split-heading"><div><p className="kicker">In Deiner Nähe</p><h2>Frauen aus deutschen Städten kennenlernen</h2></div><Link className="button button-outline" href="/partnersuche">Alle Städte ansehen</Link></div><div className="city-grid">{cities.map((city) => <Link href={city.path} className="city-card" key={city.path}><span>Sie sucht Sie in</span><strong>{locationName(city.path)}</strong><small>Region entdecken →</small></Link>)}</div></section>

    <section className="wrap feature success"><img src={staticAsset("/home/erfolg.webp")} alt="Zwei Frauen, die ihr Glück miteinander gefunden haben" width="555" height="401" /><div><p className="kicker">Echte Verbindungen</p><h2>Wenn aus einem Klick eine gemeinsame Geschichte wird.</h2><p>Jeden Tag entstehen neue Kontakte und Beziehungen. Einige Paare teilen ihre Geschichte – als Mutmacherinnen für alle, die noch am Anfang stehen.</p><a className="button button-pink" href={platform.successStories}>Erfolgsgeschichten lesen</a></div></section>
  </main>;
}

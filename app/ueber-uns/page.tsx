import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_REVIEWS_PATH, ABOUT_ROOT_PATH, ABOUT_SOCIAL_PATH } from "@/lib/about-pages.mjs";
import { buildBreadcrumbs, buildBreadcrumbSchema } from "@/lib/breadcrumbs.mjs";
import { serializePageEntityGraph } from "@/lib/page-entities.mjs";
import { platform, registrationUrl, SITE_URL } from "@/lib/site";
import { publicUrl } from "@/lib/site-contract.mjs";
import { socialChannels, socialProfileUrls } from "@/lib/social-channels";
import { SocialIcon } from "@/components/social-icon";
import { staticAsset } from "@/lib/static-asset.mjs";

const canonical = publicUrl(ABOUT_ROOT_PATH);
const title = "Über uns: Wer hinter Sie-sucht-Sie.de steht";
const description = "Lerne die Plattform hinter Sie-sucht-Sie.de kennen: Betrieb, Redaktion, Bewertungen, Erfahrungen und unsere Social-Media-Kanäle.";

// Scores and wording come from the imported ICONY page /bewertungen-und-erfahrungen and the footer seal.
const ratings = [
  { source: "Trustpilot", score: "4,4", scale: "5", label: "Sterne", text: "Nutzerinnen loben die einfache Anmeldung, die Übersichtlichkeit der Funktionen und die vielen aktiven Mitglieder.", href: "https://www.trustpilot.com/review/sie-sucht-sie.de" },
  { source: "Singlebörsen-Überblick.de", score: "4,5", scale: "5", label: "Sterne", text: "Hervorgehoben wird die klare Ausrichtung auf lesbische Frauen, die ernsthafte Kontakte leichter macht.", href: "https://singleboersen-ueberblick.de/testbericht/sie-sucht-sie-de" },
  { source: "Singlebörsen-Vergleichen.de", score: null, scale: null, label: "Testbericht", text: "Betont werden die faire Preisgestaltung und die Möglichkeit, die Plattform erst einmal kostenlos zu testen.", href: "https://www.singleboersen-vergleichen.de/singleportal/sie-sucht-sie/" },
] as const;

const profileChannels = socialChannels.filter((channel) => channel.profile);

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, images: [staticAsset("/about/magazin-redaktion.webp")] },
};

function aboutEntityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Sie-sucht-Sie.de", inLanguage: "de-DE" },
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Sie-sucht-Sie.de", url: `${SITE_URL}/`, logo: staticAsset("/brand/logo.svg"), sameAs: socialProfileUrls },
      { "@type": "AboutPage", "@id": `${canonical}#webpage`, url: canonical, name: "Über uns", description, inLanguage: "de-DE", isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#organization` } },
    ],
  };
}

export default function AboutPage() {
  const breadcrumbs = buildBreadcrumbs(ABOUT_ROOT_PATH, "Über uns");
  return <main className="wrap page-shell about-page">
    <article className="article-card">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{breadcrumbs.map((item, index) => <li key={item.path}>{index < breadcrumbs.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>
      <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema(ABOUT_ROOT_PATH, "Über uns"))}</script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializePageEntityGraph(aboutEntityGraph()) }} />

      <header className="about-hero">
        <p className="kicker">Hinter den Kulissen</p>
        <h1>Über Sie-sucht-Sie und die Menschen dahinter</h1>
        <p className="lead">Sie-sucht-Sie.de bringt Frauen zusammen, die Frauen lieben. Hier erfährst Du, wer hinter der Plattform steht, wie andere uns bewerten und wo Du uns auf Social Media findest.</p>
        <ul className="about-chips" aria-label="Themen auf dieser Seite">
          <li><a href="#wer-wir-sind">Wer wir sind</a></li>
          <li><a href="#bewertungen">Bewertungen &amp; Erfahrungen</a></li>
          <li><a href="#social-media">Social Media</a></li>
        </ul>
      </header>

      <section className="about-section" id="wer-wir-sind" aria-labelledby="wer-wir-sind-title">
        <div className="about-section-heading">
          <p className="kicker">Wer wir sind</p>
          <h2 id="wer-wir-sind-title">Eine Community von Frauen für Frauen</h2>
          <p>Sie-sucht-Sie.de ist eine deutschsprachige Singlebörse für lesbische und bisexuelle Frauen – für die feste Beziehung genauso wie für neue Freundschaften und ehrliche Flirts.</p>
        </div>
        <div className="about-card-grid about-card-grid-duo">
          <div className="about-card">
            <img className="about-card-image" src={staticAsset("/about/betrieb-support.webp")} alt="Frau lächelt beim Selfie in die Kamera" width="720" height="450" loading="lazy" />
            <p className="kicker">Betrieb &amp; Support</p>
            <h3>Im Partnernetzwerk der ICONY GmbH</h3>
            <p>Über 20 Jahre Dating-Erfahrung und Server in Deutschland: Unser Supportteam prüft zu Deiner Sicherheit jedes Profil.</p>
            <a className="about-card-link" href={platform.legal}>Zum Impressum</a>
          </div>
          <div className="about-card">
            <img className="about-card-image" src={staticAsset("/about/magazin-redaktion.webp")} alt="Zwei Frauen lachen sich in einer Bar an" width="720" height="450" loading="lazy" />
            <p className="kicker">Magazin &amp; Redaktion</p>
            <h3>Wissen rund um lesbisches Dating</h3>
            <p>Unsere Redaktion schreibt über Dating, Beziehungen und Community-Themen – verständlich und nah an dem, was Frauen bewegt, die Frauen lieben.</p>
            <Link className="about-card-link" href="/magazin">Zum Magazin</Link>
          </div>
        </div>
      </section>

      <section className="about-section about-reviews" id="bewertungen" aria-labelledby="bewertungen-title">
        <div className="about-section-heading">
          <p className="kicker">Bewertungen &amp; Erfahrungen</p>
          <h2 id="bewertungen-title">Vertrauen entsteht durch echte Eindrücke</h2>
          <p>Nutzerinnen und unabhängige Vergleichsportale bewerten Sie-sucht-Sie.de. Hier siehst Du die wichtigsten Einordnungen auf einen Blick.</p>
        </div>
        <div className="about-card-grid">
          {ratings.map((rating) => <a className="about-rating" href={rating.href} key={rating.source} rel="nofollow noopener noreferrer" target="_blank">
            <span className="about-rating-score">{rating.score ? <><strong>{rating.score}</strong> / {rating.scale} {rating.label}</> : <strong>{rating.label}</strong>}</span>
            <span className="about-rating-source">{rating.source}</span>
            <span className="about-rating-text">{rating.text}</span>
          </a>)}
        </div>
        <div className="about-section-actions">
          <Link className="button button-pink" href={ABOUT_REVIEWS_PATH}>Alle Bewertungen &amp; Erfahrungen</Link>
          <img src={staticAsset("/trust/empfohlen-45-sterne.png")} alt="Empfohlen von Singlebörsen-Überblick.de – 4,5 Sterne" width="300" height="60" />
        </div>
      </section>

      <section className="about-section about-social" id="social-media" aria-labelledby="social-media-title">
        <div className="about-section-heading">
          <p className="kicker">Social Media</p>
          <h2 id="social-media-title">Folge uns auf unseren Kanälen</h2>
          <p>Liebesgeschichten, Community-Themen und Neuigkeiten rund um die Plattform – dort, wo Du ohnehin unterwegs bist.</p>
        </div>
        <div className="about-card-grid">
          {profileChannels.map((channel) => <a className="about-social-card" href={channel.href} key={channel.href} rel="nofollow noopener noreferrer" target="_blank">
            <span className={`about-social-icon social-${channel.platform}`} aria-hidden="true"><SocialIcon platform={channel.platform} /></span>
            <span className="about-social-name"><strong>{channel.name}</strong><small>{channel.handle}</small></span>
            <span className="about-social-text">{channel.text}</span>
          </a>)}
        </div>
        <div className="about-section-actions">
          <Link className="button button-outline" href={ABOUT_SOCIAL_PATH}>Zur Social-Media-Übersicht</Link>
        </div>
      </section>

      <aside className="inline-cta"><h2>Du willst nicht nur lesen, sondern Frauen kennenlernen?</h2><p>Erstelle kostenlos Dein Profil und entdecke Frauen aus Deiner Region, die ähnliche Wünsche und Werte mitbringen.</p><a className="button button-green" href={registrationUrl(ABOUT_ROOT_PATH)}>Jetzt kostenlos starten</a></aside>
    </article>
  </main>;
}

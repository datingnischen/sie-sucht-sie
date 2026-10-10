import type { Metadata } from "next";
import Link from "next/link";
import { publicPages } from "@/lib/content";
import { buildCityCards } from "@/lib/location-hub.mjs";
import { getMagazineEntry, magazinePosts } from "@/lib/magazine";
import { platform, registrationUrl, SITE_URL } from "@/lib/site";
import { buildPageEntityGraph, serializePageEntityGraph } from "@/lib/page-entities.mjs";
import { staticAsset } from "@/lib/static-asset.mjs";
import { ArrowIcon, BookIcon, ChatIcon, CheckIcon, HeartFilledIcon, HeartIcon, PinIcon, ShieldIcon, SparkIcon, VenusPairIcon } from "@/components/icons";
import "./home.css";

export const metadata: Metadata = {
  title: "Sie sucht Sie – Frau sucht Frau in Deiner Nähe | Singlebörse",
  description: "Frau sucht Frau: Lerne kostenlos lesbische und bisexuelle Frauen in Deiner Nähe kennen – sicher, mit Herz und über 20 Jahren Dating-Erfahrung.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { images: [staticAsset("/home/hero.webp")] },
};

const trust = [
  [ShieldIcon, "Sicher kennenlernen", "Server in Deutschland und sorgfältige Profilprüfung schaffen einen geschützten Einstieg.", platform.safety],
  [CheckIcon, "Redaktionelle Kontrolle", "Unser Supportteam prüft neue Profile und geht konsequent gegen auffällige Accounts vor.", platform.editorialControl],
  [HeartIcon, "Kostenlos starten", "Registrierung, Profil und viele Kontaktmöglichkeiten stehen bereits in der Basis-Mitgliedschaft offen.", platform.basicMembership],
] as const;

// „Du bist hier richtig“: jede Lebenslage führt zu einem passenden Magazinartikel.
const belonging = [
  ["Lesbisch & bereit für mehr", "Wie eine Beziehung zwischen Frauen wachsen kann.", "/magazin/lesbische-beziehung"],
  ["Bisexuell", "Frauen lieben, ohne sich in eine Schublade zu stecken.", "/magazin/bisexuell-darum-ist-jede-frau-etwas-bi"],
  ["Queer & fluid", "Was queer bedeutet – und warum es so befreiend sein kann.", "/magazin/queer"],
  ["Spätes Coming-out", "Neue Gefühle, neue Liebe – in jedem Alter.", "/magazin/spaetes-coming-out-frauen"],
  ["Über 50 & verliebt", "Wie lesbische Frauen ihr Glück auch später finden.", "/magazin/sie-sucht-sie-ueber-50"],
] as const;

const countries = [
  ["Österreich", "/oesterreich", "Wien, Graz, Salzburg …"],
  ["Schweiz", "/schweiz", "Zürich, Basel, Bern …"],
] as const;

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}

export default function HomePage() {
  const cities = (buildCityCards(publicPages, "partnersuche") as Array<{ path: string; name: string; teaser: string; image: { src: string; alt: string } | null }>).slice(0, 6);
  const cityCount = publicPages.filter((page) => page.type === "location" && page.path.split("/").length === 3).length;
  const stories = belonging.map(([title, text, path]) => ({ title, text, path, entry: getMagazineEntry(path) })).filter((item) => item.entry);
  const latest = magazinePosts.slice(0, 3);
  const register = registrationUrl("/");
  const pageEntityGraph = buildPageEntityGraph({
    path: "/",
    canonical: `${SITE_URL}/`,
    type: "editorial",
    h1: "Frau sucht Frau: Finde eine Partnerin, die wirklich zu Dir passt.",
    description: metadata.description,
  });
  return <main className="home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializePageEntityGraph(pageEntityGraph) }} />

    <section className="home-hero">
      <span className="home-hero-glow" aria-hidden="true" />
      <div className="wrap home-hero-grid">
        <div className="home-hero-copy">
          <span className="home-badge"><VenusPairIcon /> Für lesbische & bisexuelle Frauen</span>
          <h1>Frau sucht Frau: Finde eine Partnerin, die <em>wirklich zu Dir passt.</em></h1>
          <p className="home-lead">Ob große Liebe, ehrliche Gespräche im <Link href="/lexikon/kostenloser-lesbenchat">Lesbenchat</Link> oder neue Kontakte: Bei Sie-sucht-Sie.de begegnest Du Frauen, die Frauen lieben – direkt in Deiner Nähe.</p>
          <div className="home-actions">
            <a className="button button-green" href={register}>Kostenlos registrieren</a>
            <Link className="button button-ghost-light" href="/partnersuche">Frauen in Deiner Stadt</Link>
          </div>
          <ul className="home-hero-trust">
            <li><CheckIcon />Über 20 Jahre Erfahrung</li>
            <li><CheckIcon />Server in Deutschland</li>
            <li><CheckIcon />Keine versteckten Kosten</li>
          </ul>
        </div>
        <figure className="home-hero-media">
          <span className="home-arch">
            <img src={staticAsset("/home/hero.webp")} alt="Zwei glückliche Frauen in einer liebevollen Begegnung" width="1170" height="659" fetchPriority="high" />
          </span>
          <span className="home-float home-float-chat"><ChatIcon /><span><small>Fragenflirt</small>Strand oder Berge?</span></span>
          <span className="home-float home-float-heart" aria-hidden="true"><HeartFilledIcon /></span>
          <span className="home-float home-float-pin"><PinIcon /><span><small>Partnersuche</small>{cityCount} Städte in DE, AT & CH</span></span>
        </figure>
      </div>
      <svg className="home-hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90V38C220 78 460 90 720 62S1210 0 1440 30v60Z" /></svg>
    </section>

    <section className="wrap home-trust" aria-label="Warum Sie-sucht-Sie.de">
      {trust.map(([Icon, title, text, href]) => <a className="home-trust-card" href={href} key={title}>
        <span className="home-trust-icon"><Icon /></span>
        <span><strong>{title}</strong><span>{text}</span><em>Mehr erfahren <ArrowIcon /></em></span>
      </a>)}
    </section>

    {stories.length ? <section className="wrap home-section" aria-labelledby="home-belonging">
      <div className="home-heading">
        <p className="kicker">Du bist hier richtig</p>
        <h2 id="home-belonging">Lesbisch, bi, queer – <em>oder einfach verliebt.</em></h2>
        <p>Keine Schublade, kein Druck: Hier treffen sich Frauen, die Frauen lieben, in jeder Lebensphase. Unser Magazin begleitet Dich dabei.</p>
      </div>
      <div className="home-belonging">
        {stories.map((story, index) => <Link className={`home-belong-card home-belong-${index}`} href={story.path} key={story.path}>
          {story.entry?.featuredImage ? <img src={story.entry.featuredImage} alt={`Magazinartikel: ${story.entry.title}`} loading="lazy" /> : null}
          <span className="home-belong-shade" aria-hidden="true" />
          <span className="home-belong-copy"><strong>{story.title}</strong><span>{story.text}</span><em>Weiterlesen <ArrowIcon /></em></span>
        </Link>)}
      </div>
    </section> : null}

    <section className="wrap home-flirts" aria-label="Flirtfunktionen">
      <div className="home-flirt home-flirt-light">
        <img src={staticAsset("/home/fragenflirt.webp")} alt="Strand oder Berge – spielerisch Gemeinsamkeiten entdecken" width="361" height="311" loading="lazy" />
        <div><p className="kicker">Fragenflirt</p><h2>Strand oder Berge?</h2><p>Entdeckt spielerisch, ob Eure Wünsche, Werte und Träume zusammenpassen. So entsteht ein Gespräch, das gleich ein bisschen persönlicher ist.</p><a className="text-link" href={`${SITE_URL}/fragenflirt.html`}>Fragenflirt entdecken →</a></div>
      </div>
      <div className="home-flirt home-flirt-dark">
        <div><p className="kicker">Fotoflirt</p><h2>Manchmal beginnt ein Flirt mit einem <em>Blick.</em></h2><p>Wenn die richtigen Worte noch fehlen, hilft der Fotoflirt beim unkomplizierten ersten Kennenlernen.</p><a className="text-link light" href={`${SITE_URL}/fotoflirt.html`}>Fotoflirt ausprobieren →</a></div>
        <img src={staticAsset("/home/fotoflirt.webp")} alt="Fotoflirt mit Profilbildern von Frauen" width="449" height="275" loading="lazy" />
      </div>
    </section>

    <section className="wrap home-section" aria-labelledby="home-cities">
      <div className="home-heading home-heading-split">
        <div><p className="kicker">In Deiner Nähe</p><h2 id="home-cities">Frauen aus Deiner Stadt <em>kennenlernen</em></h2></div>
        <Link className="button button-outline" href="/partnersuche">Alle Städte ansehen</Link>
      </div>
      <div className="home-cities">
        {cities.map((city, index) => <Link className={`home-city${index === 0 ? " home-city-lead" : ""}`} href={city.path} key={city.path}>
          {city.image ? <img src={city.image.src} alt={`Stadtansicht von ${city.name}`} loading="lazy" /> : null}
          <span className="home-city-shade" aria-hidden="true" />
          <span className="home-city-copy"><small><PinIcon /> Sie sucht Sie in</small><strong>{city.name}</strong><span>{city.teaser}</span></span>
        </Link>)}
        {countries.map(([name, href, text]) => <Link className="home-country" href={href} key={href}>
          <small>Auch in</small><strong>{name}</strong><span>{text}</span><em><ArrowIcon /></em>
        </Link>)}
        <Link className="home-country home-country-all" href="/partnersuche"><small>Alle Regionen</small><strong>{cityCount} Städte</strong><span>Deutschland, Österreich & Schweiz</span><em><ArrowIcon /></em></Link>
      </div>
    </section>

    <section className="wrap home-section" aria-labelledby="home-magazin">
      <div className="home-heading home-heading-split">
        <div><p className="kicker">Aus dem Magazin</p><h2 id="home-magazin">Liebe, Szene &amp; <em>Coming-out</em></h2></div>
        <Link className="button button-outline" href="/magazin">Zum Magazin</Link>
      </div>
      <div className="home-posts">
        {latest.map((post) => <Link className="home-post" href={post.path} key={post.id}>
          <span className="home-post-media">{post.featuredImage ? <img src={post.featuredImage} alt={`Titelbild: ${post.title}`} loading="lazy" /> : <BookIcon />}</span>
          <span className="home-post-copy"><small>{post.categories[0]?.name || "Magazin"}</small><strong>{post.title}</strong><time dateTime={post.modified || post.date}>Aktualisiert am {dateLabel(post.modified || post.date)}</time></span>
        </Link>)}
      </div>
    </section>

    <section className="wrap home-success">
      <figure><img src={staticAsset("/home/erfolg.webp")} alt="Zwei Frauen, die ihr Glück miteinander gefunden haben" width="555" height="401" loading="lazy" /><span className="home-success-spark" aria-hidden="true"><SparkIcon /></span></figure>
      <div><p className="kicker">Echte Verbindungen</p><h2>Wenn aus einem Klick eine <em>gemeinsame Geschichte</em> wird.</h2><p>Jeden Tag entstehen neue Kontakte und Beziehungen. Einige Paare teilen ihre Geschichte – als Mutmacherinnen für alle, die noch am Anfang stehen.</p><a className="button button-pink" href={platform.successStories}>Erfolgsgeschichten lesen</a></div>
    </section>
  </main>;
}

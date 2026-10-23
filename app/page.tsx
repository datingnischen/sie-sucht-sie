import type { Metadata } from "next";
import Link from "@/components/link";
import { publicPages } from "@/lib/content";
import { buildCityCards } from "@/lib/location-hub.mjs";
import { getMagazineEntry, magazinePosts } from "@/lib/magazine";
import { platform, registrationUrl, SITE_URL } from "@/lib/site";
import { buildPageEntityGraph, serializePageEntityGraph } from "@/lib/page-entities.mjs";
import { staticAsset } from "@/lib/static-asset.mjs";
import { ArrowIcon, BookIcon, ChatIcon, CheckIcon, HeartFilledIcon, HeartIcon, PinIcon, ShieldIcon, SparkIcon, VenusPairIcon } from "@/components/icons";
import "./home.css";

export const metadata: Metadata = {
  title: "Sie sucht Sie: Frauen kennenlernen in Deiner Nähe",
  description: "Frauen kennenlernen bei Sie-sucht-Sie.de: für lesbische und bisexuelle Frauen. Kostenlos registrieren, Dein Profil gestalten und Kontakte in Deiner Nähe finden.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: { images: [staticAsset("/home/hero.webp")] },
};

const trust = [
  [ShieldIcon, "Sicher kennenlernen", "Server in Deutschland und sorgfältige Profilprüfung schaffen einen geschützten Einstieg.", platform.safety],
  [CheckIcon, "Redaktionelle Kontrolle", "Unser Supportteam prüft neue Profile und geht konsequent gegen auffällige Accounts vor.", platform.editorialControl],
  [HeartIcon, "Kostenlose Basis-Mitgliedschaft", "Registrierung, Profil und viele Kontaktmöglichkeiten stehen bereits in der Basis-Mitgliedschaft offen.", platform.basicMembership],
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
          <p className="home-lead">Du möchtest Frauen kennenlernen – für eine Beziehung, einen Flirt oder neue Kontakte? Bei Sie-sucht-Sie.de begegnest Du lesbischen und bisexuellen Frauen. Entdecke Profile aus Deiner Region und finde im <Link href="/lexikon/kostenloser-lesbenchat">Lesbenchat</Link> einen Einstieg ins Gespräch.</p>
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
      {trust.map(([Icon, title, text, href]) => <div className="home-trust-card has-card-link" key={title}>
        <span className="home-trust-icon"><Icon /></span>
        <span><strong><a className="card-link" href={href}>{title}</a></strong><span>{text}</span><em aria-hidden="true">Mehr erfahren <ArrowIcon /></em></span>
      </div>)}
    </section>

    <section className="wrap home-section" aria-labelledby="home-kennenlernen">
      <div className="home-heading">
        <p className="kicker">Dein Einstieg</p>
        <h2 id="home-kennenlernen">Frauen kennenlernen: <em>So beginnt Euer Kontakt.</em></h2>
        <p>Du entscheidest, wen Du kennenlernen möchtest und wie schnell Du Dich öffnen willst. Ein ehrliches Profil und ein persönlicher Gesprächseinstieg helfen Euch, Gemeinsamkeiten zu entdecken.</p>
      </div>
      <ol className="home-steps">
        <li><span className="home-step-number" aria-hidden="true">1</span><h3>Profil anlegen</h3><p>Registriere Dich kostenlos. Erzähle von Deinen Interessen und davon, ob Du eine Partnerin, einen Flirt oder neue Bekanntschaften suchst.</p></li>
        <li><span className="home-step-number" aria-hidden="true">2</span><h3>Frauen in Deiner Nähe entdecken</h3><p>Starte mit Deiner Region. Über unsere <Link href="/partnersuche">Städteübersicht</Link> findest Du die passenden Einstiege in Deutschland, Österreich und der Schweiz.</p></li>
        <li><span className="home-step-number" aria-hidden="true">3</span><h3>Persönlich ins Gespräch kommen</h3><p>Greife ein gemeinsames Interesse auf, statt nur „Hallo“ zu schreiben. Wenn Ihr Euch wohlfühlt, könnt Ihr ein erstes Treffen an einem öffentlichen Ort vereinbaren.</p></li>
      </ol>
      <p className="home-membership-note">Die Registrierung ist kostenlos. Welche Funktionen die Basis-Mitgliedschaft umfasst und welche Extras kostenpflichtig sind, erfährst Du in den <a href={platform.basicMembership}>Informationen zur kostenlosen Basis-Mitgliedschaft</a>.</p>
    </section>

    {stories.length ? <section className="wrap home-section" aria-labelledby="home-belonging">
      <div className="home-heading">
        <p className="kicker">Du bist hier richtig</p>
        <h2 id="home-belonging">Lesbisch, bi, queer – <em>oder einfach verliebt.</em></h2>
        <p>Keine Schublade, kein Druck: Hier treffen sich Frauen, die Frauen lieben, in jeder Lebensphase. Unser Magazin begleitet Dich dabei.</p>
      </div>
      <div className="home-belonging">
        {stories.map((story, index) => <div className={`home-belong-card home-belong-${index} has-card-link`} key={story.path}>
          {story.entry?.featuredImage ? <img src={story.entry.featuredImage} alt={`Magazinartikel: ${story.entry.title}`} loading="lazy" /> : null}
          <span className="home-belong-shade" aria-hidden="true" />
          <span className="home-belong-copy"><strong><Link className="card-link" href={story.path}>{story.title}</Link></strong><span>{story.text}</span><em>Weiterlesen <ArrowIcon /></em></span>
        </div>)}
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
        {cities.map((city, index) => <div className={`home-city has-card-link${index === 0 ? " home-city-lead" : ""}`} key={city.path}>
          {city.image ? <img src={city.image.src} alt={`Stadtansicht von ${city.name}`} loading="lazy" /> : null}
          <span className="home-city-shade" aria-hidden="true" />
          <span className="home-city-copy"><small><PinIcon /> Sie sucht Sie in</small><strong><Link className="card-link" href={city.path}>{city.name}</Link></strong><span>{city.teaser}</span></span>
        </div>)}
        {countries.map(([name, href, text]) => <Link className="home-country" href={href} key={href}>
          <small>Auch in</small><span className="sx-strong">{name}</span><span>{text}</span><em><ArrowIcon /></em>
        </Link>)}
        <Link className="home-country home-country-all" href="/partnersuche"><small>Alle Regionen</small><span className="sx-strong">{cityCount} Städte</span><span>Deutschland, Österreich & Schweiz</span><em><ArrowIcon /></em></Link>
      </div>
    </section>

    <section className="wrap home-section" aria-labelledby="home-magazin">
      <div className="home-heading home-heading-split">
        <div><p className="kicker">Aus dem Magazin</p><h2 id="home-magazin">Liebe, Szene &amp; <em>Coming-out</em></h2></div>
        <Link className="button button-outline" href="/magazin">Zum Magazin</Link>
      </div>
      <div className="home-posts">
        {latest.map((post) => <div className="home-post has-card-link" key={post.id}>
          <span className="home-post-media">{post.featuredImage ? <img src={post.featuredImage} alt={`Titelbild: ${post.title}`} loading="lazy" /> : <BookIcon />}</span>
          <span className="home-post-copy"><small>{post.categories[0]?.name || "Magazin"}</small><strong><Link className="card-link" href={post.path}>{post.title}</Link></strong><time dateTime={post.modified || post.date}>Aktualisiert am {dateLabel(post.modified || post.date)}</time></span>
        </div>)}
      </div>
    </section>

    <section className="wrap home-section" aria-labelledby="home-faq">
      <div className="home-heading"><p className="kicker">Gut zu wissen</p><h2 id="home-faq">Deine Fragen zum <em>Kennenlernen.</em></h2></div>
      <div className="home-faq">
        <details><summary>Für wen ist Sie-sucht-Sie.de gedacht?</summary><p>Hier geht es um Frauen, die Frauen kennenlernen möchten: lesbische und bisexuelle Frauen sowie Frauen, die ihre Gefühle noch für sich sortieren. Du kannst offen beschreiben, ob Du eine Beziehung, einen Flirt oder neue Kontakte suchst.</p></details>
        <details><summary>Kann ich Frauen kostenlos kennenlernen?</summary><p>Du kannst Dich kostenlos registrieren und mit einer Basis-Mitgliedschaft starten. Für den aktuellen Funktionsumfang und mögliche kostenpflichtige Extras schau in die <a href={platform.basicMembership}>Informationen zur Basis-Mitgliedschaft</a>. Kostenlos registrieren bedeutet nicht, dass jede Funktion kostenlos ist.</p></details>
        <details><summary>Wie finde ich Frauen aus meiner Umgebung?</summary><p>Wähle in unserer <Link href="/partnersuche">Städteübersicht zur Partnersuche</Link> Deine Stadt oder Region. So gelangst Du zum regionalen Einstieg. Auch die Nachbarstädte können interessant sein, wenn Du etwas weiter suchen möchtest.</p></details>
        <details><summary>Was hilft beim ersten Anschreiben?</summary><p>Nimm Bezug auf ein Interesse oder eine Frage im Profil. Eine kurze, persönliche Nachricht macht den Einstieg leichter. Lass Deinem Gegenüber Zeit und respektiere, wenn kein Interesse besteht. Mehr Ideen findest Du im <Link href="/magazin/lesbentreff">Lesbentreff-Ratgeber</Link>.</p></details>
        <details><summary>Worauf sollte ich beim Online-Dating achten?</summary><p>Teile Anschrift, Arbeitsplatz und private Kontaktdaten erst, wenn Du Vertrauen gefasst hast. Sende neuen Kontakten kein Geld und wähle für das erste Treffen einen öffentlichen Ort. Lies auch unsere <a href={platform.safety}>Hinweise zu Sicherheit und Datenschutz</a>.</p></details>
        <details><summary>Wo kann ich Frauen auch vor Ort treffen?</summary><p>Kulturabende, Stammtische und Frauenpartys bieten gemeinsame Anlässe zum Kennenlernen. Unsere <Link href="/magazin/lesbische-szenebars">Übersicht zu Lesbenbars und Partys</Link> hilft Dir bei der Auswahl. Für den Austausch online findest Du außerdem <Link href="/magazin/lesarion">Informationen zur Lesarion-Community</Link>.</p></details>
      </div>
    </section>

    <section className="wrap home-success">
      <figure><img src={staticAsset("/home/erfolg.webp")} alt="Zwei Frauen, die ihr Glück miteinander gefunden haben" width="555" height="401" loading="lazy" /><span className="home-success-spark" aria-hidden="true"><SparkIcon /></span></figure>
      <div><p className="kicker">Echte Verbindungen</p><h2>Wenn aus einem Klick eine <em>gemeinsame Geschichte</em> wird.</h2><p>Jeden Tag entstehen neue Kontakte und Beziehungen. Einige Paare teilen ihre Geschichte – als Mutmacherinnen für alle, die noch am Anfang stehen.</p><a className="button button-pink" href={platform.successStories}>Erfolgsgeschichten lesen</a></div>
    </section>
  </main>;
}

import Link from "next/link";
import { registrationUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowIcon, BookIcon, ClockIcon, HeartFilledIcon, SparkIcon, VenusPairIcon } from "@/components/icons";
import type { ImportedView } from "@/components/imported-view";
import { cleanImportedHtml, extractCredit, splitSections } from "./imported-html";
import { ALPHABET, lexikonTerms, magazineLinksFor, magazineTermBridge, parseLexikonIndex, shortMagazineTitle, termFor } from "./lexikon-data";
import "./lexikon.css";

// Buchstabenplättchen im Hero der Übersicht (Wortspiel-Optik, Punkte wie beim deutschen Scrabble).
const TILES = [["L", 2], ["I", 1], ["E", 1], ["B", 3], ["E", 1]] as const;

const minutesLabel = (minutes: number) => `${minutes} Min. Lesezeit`;
const chaptersLabel = (count: number) => (count === 1 ? "1 Abschnitt" : `${count} Abschnitte`);

/** /lexikon/ – Übersicht aller Begriffe als Wörterbuch von A bis Z. */
export function LexikonHub({ page, path, image, contentHtml, breadcrumbs }: ImportedView) {
  const terms = lexikonTerms();
  const { html: cleaned, credit } = extractCredit(cleanImportedHtml(contentHtml));
  const index = parseLexikonIndex(cleaned);
  const activeLetters = new Set(terms.map((term) => term.letter));
  const bridge = magazineTermBridge();
  const registration = registrationUrl(path);

  return <main className="lx-page">
    <header className="lx-hero lx-hero-hub">
      <span className="lx-hero-watermark" aria-hidden="true">Aa</span>
      <div className="wrap lx-hero-grid">
        <div className="lx-hero-copy">
          <Breadcrumbs items={breadcrumbs} className="lx-crumbs" />
          <p className="lx-badge"><BookIcon /> Kurz erklärt</p>
          <h1>{page.h1}</h1>
          <p className="lx-hero-tag" aria-hidden="true">von <em>A</em> bis <em>Z</em></p>
          <p className="lx-hero-lead">{page.description}</p>
          <ul className="lx-hero-facts" aria-label="Das Lexikon in Zahlen">
            <li><strong>{terms.length}</strong> Begriffe</li>
            <li><strong>{activeLetters.size}</strong> Buchstaben</li>
            {bridge.glossary ? <li><strong>{bridge.glossary.count}</strong> weitere im Magazin-Glossar</li> : null}
          </ul>
          <div className="lx-hero-actions">
            <a className="button button-green" href="#begriffe">Begriffe von A bis Z</a>
            {bridge.glossary ? <Link className="button button-ghost-light" href={bridge.glossary.path}>Zum Magazin-Glossar</Link> : null}
          </div>
        </div>
        <figure className="lx-hero-media">
          <span className="lx-arch">{image ? <img src={image.src} alt={image.alt || page.h1} width={560} height={700} fetchPriority="high" /> : null}</span>
          <span className="lx-tiles" aria-hidden="true">{TILES.map(([letter, points], tileIndex) => <span className="lx-tile" key={tileIndex}>{letter}<small>{points}</small></span>)}</span>
          <span className="lx-hero-heart" aria-hidden="true"><HeartFilledIcon /></span>
        </figure>
      </div>
    </header>

    <nav className="lx-az" aria-label="Begriffe von A bis Z">
      <div className="wrap lx-az-inner">
        <span className="lx-az-label">A–Z</span>
        <ol>{ALPHABET.map((letter) => <li key={letter}>{activeLetters.has(letter) ? <a href={`#buchstabe-${letter.toLowerCase()}`}>{letter}</a> : <span aria-hidden="true">{letter}</span>}</li>)}</ol>
      </div>
    </nav>

    <section className="wrap lx-index" id="begriffe" aria-label="Alle Begriffe">
      <div className="lx-index-head rich-content lx-prose" dangerouslySetInnerHTML={{ __html: index.before }} />
      <ol className="lx-dict">
        {terms.map((term, termIndex) => {
          const listed = index.items.get(term.path);
          const firstOfLetter = termIndex === 0 || terms[termIndex - 1].letter !== term.letter;
          return <li className="lx-dict-item" id={firstOfLetter ? `buchstabe-${term.letter.toLowerCase()}` : undefined} key={term.path}>
            <Link className="lx-dict-entry" href={term.path}>
              <span className="lx-dict-letter" aria-hidden="true">{term.letter}</span>
              <span className="lx-dict-body">
                <span className="lx-dict-word">{term.term}</span>
                <span className="lx-dict-meta"><ClockIcon /> {term.minutes} Min. · {chaptersLabel(term.chapters)}</span>
                <span className="lx-dict-text">{listed?.text || term.description}</span>
                <span className="lx-dict-more">{listed?.label || term.h1} <ArrowIcon /></span>
              </span>
            </Link>
          </li>;
        })}
      </ol>
      <div className="lx-outro">
        <span className="lx-outro-icon" aria-hidden="true"><VenusPairIcon /></span>
        <div className="rich-content lx-prose" dangerouslySetInnerHTML={{ __html: index.after }} />
      </div>
      {credit ? <p className="lx-credit">{credit}</p> : null}
    </section>

    {bridge.featured.length || bridge.glossary ? <section className="lx-bridge" aria-labelledby="lx-bridge-title">
      <div className="wrap">
        <div className="lx-section-head">
          <p className="kicker">Tiefer eintauchen</p>
          <h2 id="lx-bridge-title">Mehr Begriffe im <em>Magazin</em></h2>
          <p>Queer, bi, pan oder demi? Im Magazin erklärt die Redaktion weitere Begriffe rund um Identität, Liebe und Community.</p>
        </div>
        <div className="lx-bridge-grid">
          {bridge.glossary ? <Link className="lx-glossary-card" href={bridge.glossary.path}>
            <span className="lx-glossary-letters" aria-hidden="true">{bridge.glossary.letters.map((letter) => <i key={letter}>{letter}</i>)}</span>
            <span className="lx-glossary-body">
              <small>Magazin · {bridge.glossary.title}</small>
              <strong>{bridge.glossary.count} Begriffe von A bis Z</strong>
              <span>Vom Coming-out bis zur Lesbenflagge: das große Glossar im Magazin.</span>
              <em>Glossar öffnen <ArrowIcon /></em>
            </span>
          </Link> : null}
          {bridge.featured.map((entry) => <Link className="lx-mag-card" href={entry.path} key={entry.path}>
            <span className="lx-mag-media">{entry.featuredImage ? <img src={entry.featuredImage} alt={`Titelbild: ${entry.title}`} loading="lazy" decoding="async" width={400} height={260} /> : <SparkIcon />}</span>
            <span className="lx-mag-body"><small>Begriff im Magazin</small><strong>{entry.title}</strong></span>
          </Link>)}
        </div>
        {bridge.more.length ? <div className="lx-chips-row">
          <span>Auch erklärt:</span>
          <ul className="lx-chips">{bridge.more.map((entry) => <li key={entry.path}><Link href={entry.path}>{shortMagazineTitle(entry)}</Link></li>)}</ul>
        </div> : null}
      </div>
    </section> : null}

    <section className="wrap lx-cta-band" aria-labelledby="lx-cta-title">
      <div>
        <p className="kicker">Genug gelesen?</p>
        <h2 id="lx-cta-title">Lerne Frauen kennen, die <em>Frauen lieben</em></h2>
        <p>Erstelle kostenlos Dein Profil und entdecke Frauen, die ähnliche Wünsche und Werte mitbringen.</p>
      </div>
      <a className="button button-green" href={registration}>Kostenlos registrieren</a>
    </section>
  </main>;
}

/** /lexikon/<begriff>/ – ein Eintrag als Begriffskarte mit Kapiteln, Inhaltsverzeichnis und Querverweisen. */
export function LexikonEntry({ page, path, image, contentHtml, breadcrumbs }: ImportedView) {
  const current = termFor(page);
  const terms = lexikonTerms();
  const position = terms.findIndex((term) => term.path === path);
  const previous = position > 0 ? terms[position - 1] : null;
  const next = position >= 0 && position < terms.length - 1 ? terms[position + 1] : null;
  const others = terms.filter((term) => term.path !== path);
  const { html: cleaned, credit } = extractCredit(cleanImportedHtml(contentHtml));
  const { intro, sections } = splitSections(cleaned);
  const magazine = magazineLinksFor(current.slug);
  const registration = registrationUrl(path);

  return <main className="lx-page">
    <header className="lx-hero lx-hero-entry">
      <span className="lx-hero-watermark" aria-hidden="true">{current.letter}</span>
      <div className="wrap lx-hero-grid">
        <div className="lx-hero-copy">
          <Breadcrumbs items={breadcrumbs} className="lx-crumbs" />
          <p className="lx-badge"><BookIcon /> Lexikon · Kurz erklärt</p>
          <h1>{page.h1}</h1>
          <p className="lx-hero-lead">{page.description}</p>
          <ul className="lx-hero-facts lx-hero-facts-inline" aria-label="Zum Eintrag">
            <li><ClockIcon /> {minutesLabel(current.minutes)}</li>
            {sections.length ? <li><BookIcon /> {chaptersLabel(sections.length)}</li> : null}
            <li><span className="lx-mini-tile" aria-hidden="true">{current.letter}</span> Stichwort {current.letter}</li>
          </ul>
          <div className="lx-hero-actions">
            <a className="button button-green" href={registration}>Kostenlos registrieren</a>
            <Link className="button button-ghost-light" href="/lexikon">Alle Begriffe</Link>
          </div>
        </div>
        <figure className="lx-hero-media">
          <span className="lx-arch">{image ? <img src={image.src} alt={image.alt || page.h1} width={560} height={700} fetchPriority="high" /> : null}</span>
          <figcaption className="lx-term-card">
            <span className="lx-term-card-letter" aria-hidden="true">{current.letter}</span>
            <span className="lx-term-card-body">
              <small>Stichwort</small>
              <strong>{current.term}</strong>
              <em>Lexikon · Sie-sucht-Sie.de</em>
            </span>
          </figcaption>
        </figure>
      </div>
    </header>

    <div className="wrap lx-entry-layout">
      <article className="lx-article">
        {intro ? <div className="rich-content lx-prose lx-intro" dangerouslySetInnerHTML={{ __html: intro }} /> : null}
        {sections.map((section, sectionIndex) => <section className="lx-chapter" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
          <header className="lx-chapter-head">
            <span className="lx-chapter-no" aria-hidden="true">{String(sectionIndex + 1).padStart(2, "0")}</span>
            <h2 id={`${section.id}-title`} dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
          </header>
          <div className="rich-content lx-prose" dangerouslySetInnerHTML={{ __html: section.html }} />
        </section>)}
        {credit ? <p className="lx-credit">{credit}</p> : null}
        {previous || next ? <nav className="lx-prevnext" aria-label="Im Lexikon blättern">
          {previous ? <Link className="lx-prevnext-link" href={previous.path} rel="prev"><small>← Vorheriger Begriff</small><strong><span aria-hidden="true">{previous.letter}</span>{previous.term}</strong></Link> : <span />}
          {next ? <Link className="lx-prevnext-link lx-prevnext-next" href={next.path} rel="next"><small>Nächster Begriff →</small><strong><span aria-hidden="true">{next.letter}</span>{next.term}</strong></Link> : <span />}
        </nav> : null}
      </article>

      <aside className="lx-aside" aria-label="Zum Eintrag">
        {sections.length > 1 ? <nav className="lx-aside-card lx-toc" aria-label="Auf dieser Seite">
          <p className="lx-aside-title">Auf dieser Seite</p>
          <ol>{sections.map((section, sectionIndex) => <li key={section.id}><a href={`#${section.id}`}><span aria-hidden="true">{String(sectionIndex + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
        </nav> : null}
        <div className="lx-aside-card lx-aside-terms">
          <p className="lx-aside-title">Weitere Begriffe</p>
          <ul>{others.map((term) => <li key={term.path}><Link href={term.path}><span className="lx-mini-tile" aria-hidden="true">{term.letter}</span>{term.term}</Link></li>)}</ul>
          <Link className="text-link" href="/lexikon">Alle Begriffe von A bis Z →</Link>
        </div>
        <div className="lx-aside-cta">
          <span className="lx-aside-cta-icon" aria-hidden="true"><VenusPairIcon /></span>
          <p className="lx-aside-cta-title">Neugierig geworden?</p>
          <p>Lerne Frauen kennen, die Frauen lieben – die Registrierung ist kostenlos.</p>
          <a className="button button-green button-compact" href={registration}>Kostenlos registrieren</a>
        </div>
      </aside>
    </div>

    {magazine.length ? <section className="wrap lx-deeper" aria-labelledby="lx-deeper-title">
      <div className="lx-section-head lx-section-head-row">
        <div>
          <p className="kicker">Weiterlesen</p>
          <h2 id="lx-deeper-title">Vertiefen im <em>Magazin</em></h2>
        </div>
        <Link className="button button-outline" href="/magazin/glossar">Zum Glossar</Link>
      </div>
      <div className="lx-deeper-grid">
        {magazine.map((entry) => <Link className="lx-mag-card" href={entry.path} key={entry.path}>
          <span className="lx-mag-media">{entry.featuredImage ? <img src={entry.featuredImage} alt={`Titelbild: ${entry.title}`} loading="lazy" decoding="async" width={400} height={260} /> : <SparkIcon />}</span>
          <span className="lx-mag-body"><small>{entry.categories[0]?.name || "Magazin"}</small><strong>{entry.title}</strong></span>
        </Link>)}
      </div>
    </section> : null}
  </main>;
}

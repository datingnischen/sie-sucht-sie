"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { platform, registrationUrl } from "@/lib/site";
import { ABOUT_REVIEWS_PATH, ABOUT_ROOT_PATH, ABOUT_SOCIAL_PATH } from "@/lib/about-pages.mjs";
import { staticAsset } from "@/lib/static-asset.mjs";
import { SITE_SEARCH_PATH } from "@/lib/site-search.mjs";
import { CheckIcon, HeartFilledIcon, MenuIcon, CloseIcon, PrideStripe, SearchIcon, VenusPairIcon } from "@/components/icons";

const nav = [
  ["Partnersuche", "/partnersuche"],
  ["Österreich", "/oesterreich"],
  ["Schweiz", "/schweiz"],
  ["Lexikon", "/lexikon"],
  ["Magazin", "/magazin"],
  ["Über uns", ABOUT_ROOT_PATH],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname() || "/";
  return (
    <header className="site-header">
      <PrideStripe />
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Sie-sucht-Sie.de Startseite">
          <img src={staticAsset("/brand/logo.svg")} alt="Sie-sucht-Sie.de – Für Single-Frauen, die Frauen suchen" width="306" height="50" />
        </Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {nav.map(([label, href]) => <Link href={href} key={label} aria-current={isActive(pathname, href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="header-search" href={SITE_SEARCH_PATH} aria-label="Magazin, Städte und Lexikon durchsuchen" title="Suche">
            <SearchIcon width={22} height={22} />
          </Link>
          <a className="login" href={platform.login}>Login</a>
          <a className="button button-green button-compact" href={registrationUrl(pathname)}>Registrieren</a>
          <details className="mobile-menu" key={pathname}>
            <summary aria-label="Menü öffnen"><MenuIcon className="mobile-menu-open" width={24} height={24} /><CloseIcon className="mobile-menu-close" width={24} height={24} /></summary>
            <div className="mobile-menu-panel">
              <nav aria-label="Mobile Navigation">
                {nav.map(([label, href]) => <Link href={href} key={label} aria-current={isActive(pathname, href) ? "page" : undefined}>{label}</Link>)}
                <Link href={SITE_SEARCH_PATH}>Suche</Link>
                <a href={platform.login}>Login</a>
              </nav>
              <a className="button button-green" href={registrationUrl(pathname)}>Kostenlos registrieren</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const pathname = usePathname() || "/";
  const register = registrationUrl(pathname);
  return (
    <footer className="site-footer">
      <section className="footer-cta">
        <span className="footer-cta-mark" aria-hidden="true"><VenusPairIcon /></span>
        <p className="kicker">Partnersuche für Frauen</p>
        <h2>Triff Frauen aus Deiner Region – <em>sicher, persönlich und kostenlos.</em></h2>
        <div className="footer-cta-actions">
          <a className="button button-green" href={register}>Jetzt kostenlos registrieren</a>
          <Link className="button button-ghost-light" href="/partnersuche">Städte entdecken</Link>
        </div>
      </section>
      <PrideStripe />
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={staticAsset("/brand/logo.svg")} alt="Sie-sucht-Sie.de" width="306" height="50" />
          <p>Eine Community für Frauen, die Frauen lieben – mit regionalen Einstiegen, Datingwissen und redaktionell geprüften Profilen.</p>
          <ul className="trust-list">{["Über 20 Jahre Dating-Erfahrung", "Server in Deutschland", "Keine versteckten Kosten beim Einstieg"].map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
          <a className="seal" href="https://singleboersen-ueberblick.de/testbericht/sie-sucht-sie-de" rel="nofollow noopener noreferrer" target="_blank">
            <img src={staticAsset("/trust/empfohlen-45-sterne.png")} alt="Empfohlen von Singlebörsen-Überblick.de – 4,5 Sterne" width="300" height="60" />
          </a>
        </div>
        <FooterColumn title="Entdecken" links={[["Partnersuche", "/partnersuche"], ["Österreich", "/oesterreich"], ["Schweiz", "/schweiz"], ["Lexikon", "/lexikon"], ["Dating-Tipps", platform.datingTips], ["Magazin", "/magazin"]]} />
        <FooterColumn title="Über uns" links={[["Über Sie-sucht-Sie", ABOUT_ROOT_PATH], ["Bewertungen & Erfahrungen", ABOUT_REVIEWS_PATH], ["Social Media", ABOUT_SOCIAL_PATH], ["Suche", SITE_SEARCH_PATH]]} />
        <FooterColumn title="Vertrauen" links={[["Sicherheit & Datenschutz", platform.safety], ["Redaktionelle Kontrolle", platform.editorialControl], ["Basis-Mitgliedschaft", platform.basicMembership], ["Erfolgsgeschichten", platform.successStories], ["FAQ", "/faq"]]} />
        <div className="footer-column"><h2>Service</h2><ul>
          <li><a href={platform.help}>Hilfe & Support</a></li><li><a href={platform.login}>Login</a></li><li><a href={register}>Registrieren</a></li>
          <li><a href={platform.privacy}>Datenschutz</a></li><li><a href={platform.legal}>Impressum</a></li><li><a href={platform.terms}>AGB</a></li>
        </ul></div>
      </div>
      <div className="subfooter"><span>© {new Date().getFullYear()} Sie-sucht-Sie.de</span><span className="subfooter-love"><HeartFilledIcon /> Für Frauen, die Frauen lieben</span><span>Im Partnernetzwerk der ICONY GmbH</span></div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <div className="footer-column"><h2>{title}</h2><ul>{links.map(([label, href]) => <li key={href}>{href.startsWith("http") ? <a href={href}>{label}</a> : <Link href={href}>{label}</Link>}</li>)}</ul></div>;
}

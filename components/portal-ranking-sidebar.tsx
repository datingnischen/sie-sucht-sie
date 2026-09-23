import Link from "next/link";
import { portalRanking } from "@/lib/portal-ranking";

export function PortalRankingSidebar({ registrationHref, currentPath }: { registrationHref: string; currentPath?: string }) {
  return (
    <aside className="portal-sidebar" aria-label="Lesbenportale im Vergleich">
      <div className="magazine-side-cta portal-sidebar-cta">
        <p className="kicker">Unsere Empfehlung</p>
        <h2>Sie-sucht-Sie.de</h2>
        <p>Die Singlebörse für Frauen, die Frauen lieben: Profil anlegen und Frauen in Deiner Nähe kennenlernen.</p>
        <a className="button button-green" href={registrationHref}>Kostenlos registrieren</a>
      </div>
      <PortalRanking currentPath={currentPath} />
    </aside>
  );
}

export function PortalRanking({ currentPath }: { currentPath?: string }) {
  return (
    <section className="portal-ranking" aria-labelledby="portal-ranking-title">
      <h2 id="portal-ranking-title">Lesbenportale im Ranking</h2>
      <p className="portal-ranking-note">Nach Mitgliederzahl laut unseren Testberichten</p>
      <ol>
        {portalRanking.map((portal) => (
          <li key={portal.path}>
            <Link href={portal.path} aria-current={portal.path === currentPath ? "page" : undefined}>
              <strong>{portal.name}</strong>
              <span>{portal.members}</span>
              <small>{portal.price}</small>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

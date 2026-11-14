import Link from "@/components/link";
import type { HubGroup } from "@/lib/magazine-hubs";
import type { MagazineEntry } from "@/lib/magazine";

/**
 * Themengruppen eines Kategorie-Hubs. Die Titel kommen aus dem Beitrag selbst, damit Hub und
 * Artikel nie auseinanderlaufen; verlinkt ist nur der Titel.
 */
export function MagazineHubGroups({ groups, entries }: { groups: HubGroup[]; entries: MagazineEntry[] }) {
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  return (
    <div className="mz-hub-groups">
      {groups.map((group) => {
        const posts = group.slugs.map((slug) => bySlug.get(slug)).filter((entry): entry is MagazineEntry => Boolean(entry));
        if (posts.length === 0) return null;
        return (
          <section className="mz-hub-group" key={group.heading}>
            <h2>{group.heading}</h2>
            <p>{group.intro}</p>
            <ul>
              {posts.map((entry) => (
                <li key={entry.id}><Link href={entry.path}>{entry.title}</Link></li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

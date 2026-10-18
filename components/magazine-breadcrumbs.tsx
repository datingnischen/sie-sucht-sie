import { Breadcrumbs } from "@/components/breadcrumbs";

type Crumb = { name: string; path: string };

/** Startseite / Magazin / (Zwischenebene) / aktuelle Seite. `mz-crumbs` ist die helle Variante für die Pflaume-Heros. */
export function MagazineBreadcrumbs({ current, trail = [], className = "mz-crumbs" }: { current?: string; trail?: Crumb[]; className?: string }) {
  const items: Crumb[] = [{ name: "Startseite", path: "/" }, { name: "Magazin", path: "/magazin" }, ...trail];
  if (current) items.push({ name: current, path: "#aktuell" });
  return <Breadcrumbs items={items} className={className} />;
}

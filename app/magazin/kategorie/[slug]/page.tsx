import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MagazineArchive } from "@/components/magazine-archive";
import { PortalRankingSidebar } from "@/components/portal-ranking-sidebar";
import { getMagazineCategory, magazineCategories, postsForMagazineCategory } from "@/lib/magazine";
import { PORTAL_RANKING_CATEGORY } from "@/lib/portal-ranking";
import { registrationUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return magazineCategories.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getMagazineCategory((await params).slug);
  if (!category) return { robots: { index: false, follow: false } };
  return { title: `${category.name} im Sie-sucht-Sie Magazin`, description: category.description || `Beiträge aus der Kategorie ${category.name}.`, alternates: { canonical: `https://www.sie-sucht-sie.de/magazin/kategorie/${category.slug}/` }, robots: { index: false, follow: true } };
}

export default async function CategoryPage({ params }: Props) {
  const category = getMagazineCategory((await params).slug);
  if (!category) notFound();
  return <MagazineArchive kicker="Magazin-Kategorie" title={category.name} intro={category.description || `Alle Beiträge aus der Kategorie ${category.name}.`} entries={postsForMagazineCategory(category.id)} aside={category.slug === PORTAL_RANKING_CATEGORY ? <PortalRankingSidebar registrationHref={registrationUrl(`/magazin/kategorie/${category.slug}`)} /> : undefined} />;
}

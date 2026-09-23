/** Portal reviews in the "Lesbenportale" category, ranked by the member counts stated in each review. */
export type RankedPortal = { name: string; path: string; members: string; price: string };

export const PORTAL_RANKING_CATEGORY = "lesbenportale";

export const portalRanking: RankedPortal[] = [
  { name: "PinkCupid", path: "/magazin/pinkcupid", members: "über 800.000 Mitglieder, international", price: "Premium ab 29,95 €" },
  { name: "Lesarion", path: "/magazin/lesarion", members: "knapp 300.000 Mitglieder", price: "günstig" },
  { name: "Lesbenschaft", path: "/magazin/lesbenschaft", members: "rund 40.000 Mitglieder", price: "günstig" },
  { name: "Lesbido", path: "/magazin/lesbido", members: "rund 38.600 Mitglieder", price: "kostenlos" },
  { name: "Venus7", path: "/magazin/venus7", members: "über 14.000 Mitglieder", price: "günstig" },
  { name: "Girlflirt", path: "/magazin/girlflirt", members: "rund 10.000 Mitglieder", price: "kostenlos" },
];

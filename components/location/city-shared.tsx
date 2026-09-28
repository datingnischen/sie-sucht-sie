import type { ReactNode } from "react";

/** Aufsteigende Herzen im Hero (Positionen im 1200×240-Raster). */
export const SUNSET_HEARTS = [
  { x: 60, y: 150, size: 26 },
  { x: 190, y: 90, size: 18 },
  { x: 330, y: 170, size: 30 },
  { x: 480, y: 110, size: 20 },
  { x: 610, y: 175, size: 24 },
  { x: 760, y: 95, size: 16 },
  { x: 890, y: 160, size: 28 },
  { x: 1030, y: 110, size: 20 },
  { x: 1140, y: 170, size: 24 },
];

/**
 * Setzt das letzte Vorkommen des Stadtnamens in der Überschrift als <em> (Sunset-Akzent).
 * Der Text bleibt Zeichen für Zeichen unverändert.
 */
export function emphasize(text: string, word: string): ReactNode {
  const index = word ? text.lastIndexOf(word) : -1;
  if (index < 0) return text;
  return <>{text.slice(0, index)}<em>{word}</em>{text.slice(index + word.length)}</>;
}

/** Szene-Guides aus dem Magazin je Stadt, dazu die Top-10-Liste des Landes. Nur Pfade, die es im Magazin gibt, werden gezeigt. */
const SCENE_GUIDES: Record<string, string> = {
  "/partnersuche/berlin": "/magazin/lesbische-szenebars-in-berlin",
  "/partnersuche/hamburg": "/magazin/lesbische-szenebars-in-hamburg",
  "/partnersuche/koeln": "/magazin/lesbische-szenebars-in-koeln",
  "/partnersuche/duesseldorf": "/magazin/lesbische-szenebars-in-duesseldorf",
  "/partnersuche/leipzig": "/magazin/lesbische-szenebars-in-leipzig",
  "/partnersuche/nuernberg": "/magazin/lesbische-szenebars-in-nuernberg",
  "/partnersuche/frankfurt-am-main": "/magazin/lesbenbars-in-frankfurt",
};

export const TOP_TEN_BY_ROOT: Record<string, string> = {
  partnersuche: "/magazin/top-10-staedte-deutschland",
  oesterreich: "/magazin/top-10-staedte-oesterreich",
  schweiz: "/magazin/top-10-staedte-schweiz",
};

export function cityMagazineTeasers(path: string, root: string): string[] {
  return [SCENE_GUIDES[path], TOP_TEN_BY_ROOT[root]].filter((entry): entry is string => Boolean(entry));
}

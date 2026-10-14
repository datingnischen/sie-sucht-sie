/**
 * Meta-Descriptions auf die in Suchergebnissen sichtbare Länge kürzen (Google schneidet bei ca. 1.000 px bzw.
 * 155–160 Zeichen ab, Seobility meldete 92 Seiten als „zu lang“). Viele Descriptions sind automatisch aus dem
 * WordPress-Auszug entstanden und enden mitten im Satz. Gekürzt wird bevorzugt am Satzende, sonst am Wortende
 * mit Auslassungszeichen. Der sichtbare Seitentext bleibt unverändert.
 */
export const META_DESCRIPTION_MAX = 155;
const MIN_SENTENCE_LENGTH = 90;

export function clampMetaDescription(text, max = META_DESCRIPTION_MAX) {
  if (!text) return text;
  const normalized = String(text).replace(/\s+/g, " ").replace(/\s*(?:\.\.\.|…)\s*$/, "").trim();
  if (normalized.length <= max) return normalized;

  const window = normalized.slice(0, max);
  let sentenceEnd = -1;
  for (const match of window.matchAll(/[.!?](?=\s|$)/g)) sentenceEnd = match.index;
  if (sentenceEnd + 1 >= MIN_SENTENCE_LENGTH) return window.slice(0, sentenceEnd + 1);

  const cut = window.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const words = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–—-]+$/, "");
  return `${words} …`;
}

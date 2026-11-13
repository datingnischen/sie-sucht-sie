// Redaktionelle Zeitstempel ohne runde Uhrzeiten: deterministisch je Schlüssel (z. B. Artikelpfad),
// damit Überarbeitungen nicht alle mit derselben Sekunde oder um Punkt 12 Uhr erscheinen.

// Stundengewichte: kaum früh morgens, Schwerpunkte vormittags, nachmittags und abends.
const HOUR_WEIGHTS = [[7, 2], [8, 5], [9, 8], [10, 10], [11, 9], [12, 6], [13, 6], [14, 8], [15, 9], [16, 8], [17, 7], [18, 6], [19, 7], [20, 8], [21, 6], [22, 3]];
const HOURS = HOUR_WEIGHTS.flatMap(([hour, weight]) => Array(weight).fill(hour));

function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

const pad = (n) => String(n).padStart(2, "0");

/** Unregelmäßige Uhrzeit „HH:MM:SS“ (07–22 Uhr, nie volle oder halbe Stunde, Sekunde nie 00). */
export function naturalTime(key, kind = "modified") {
  const x = hash(`${key}|${kind}`);
  const y = hash(`${kind}|${key}|s`);
  const hour = HOURS[x % HOURS.length];
  let minute = (x >>> 8) % 60;
  const second = 1 + (y % 59);
  if (minute === 0 || minute === 30) minute += 3 + (y % 11);
  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

/** Ortszeit ohne Offset, z. B. „2026-10-22T14:37:12“. */
export function naturalStamp(day, key, kind = "modified") {
  return `${day}T${naturalTime(key, kind)}`;
}

/** Verteilt einen Sammeltag deterministisch auf bis zu `windowDays` Tage davor (nie danach). */
export function spreadDay(day, key, windowDays = 6) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (hash(`${key}|day`) % (windowDays + 1)));
  return date.toISOString().slice(0, 10);
}

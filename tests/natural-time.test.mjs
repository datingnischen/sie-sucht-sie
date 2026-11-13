import test from "node:test";
import assert from "node:assert/strict";
import { naturalStamp, naturalTime, spreadDay } from "../lib/natural-time.mjs";
import { MAGAZINE_CORRECTIONS } from "../lib/text-corrections.mjs";

test("natural times are deterministic, daytime and never round", () => {
  const times = new Set();
  for (let i = 0; i < 300; i += 1) {
    const time = naturalTime(`/magazin/artikel-${i}`);
    assert.equal(time, naturalTime(`/magazin/artikel-${i}`));
    assert.match(time, /^(0[7-9]|1\d|2[0-2]):[0-5]\d:[0-5]\d$/);
    assert.doesNotMatch(time, /:(00|30):\d\d$|:00$/);
    times.add(time);
  }
  assert.ok(times.size > 280);
  assert.equal(naturalStamp("2026-10-22", "x").slice(0, 11), "2026-10-22T");
  const day = spreadDay("2026-10-22", "/magazin/x");
  assert.ok(day <= "2026-10-22" && day >= "2026-10-16");
});

test("fact-check revisions do not share one timestamp", () => {
  const stamps = Object.values(MAGAZINE_CORRECTIONS).flatMap((fields) => (fields.modified ?? []).map(([, value]) => value));
  assert.ok(stamps.length >= 20);
  assert.equal(new Set(stamps).size, stamps.length);
  for (const stamp of stamps) assert.match(stamp, /^2026-10-(1[6-9]|2[0-2])T(0[7-9]|1\d|2[0-2]):[0-5]\d:[0-5]\d$/);
});

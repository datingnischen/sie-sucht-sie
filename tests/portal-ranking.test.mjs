import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/magazine.json", import.meta.url), "utf8"));
const ranking = await readFile(new URL("../lib/portal-ranking.ts", import.meta.url), "utf8");
const magazine = await readFile(new URL("../lib/magazine.ts", import.meta.url), "utf8");

test("portal ranking links only to migrated portal reviews", () => {
  const paths = [...ranking.matchAll(/path: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length >= 5);
  for (const path of paths) {
    const entry = catalog.entries.find((item) => item.path === path);
    assert.ok(entry, `${path} must be a migrated post`);
    assert.ok(entry.categories.some((category) => category.slug === "lesbenportale"), `${path} must be a portal review`);
  }
});

test("guides filed under Lesbenportale in WordPress are moved to existing categories", () => {
  const block = magazine.match(/CATEGORY_CORRECTIONS[^{]*\{([^}]*)\}/)[1];
  const corrections = [...block.matchAll(/"([^"]+)": \[([^\]]*)\]/g)];
  assert.ok(corrections.some(([, slug]) => slug === "spaetes-coming-out-frauen"));
  assert.ok(corrections.some(([, slug]) => slug === "vaginale-selbsttests-dating"));
  const categorySlugs = new Set(catalog.categories.map((category) => category.slug));
  for (const [, slug, targets] of corrections) {
    assert.ok(catalog.entries.some((entry) => entry.slug === slug), `${slug} must exist`);
    for (const [, target] of targets.matchAll(/"([^"]+)"/g)) {
      assert.ok(categorySlugs.has(target), `${target} must be a public category`);
      assert.notEqual(target, "lesbenportale");
    }
  }
});

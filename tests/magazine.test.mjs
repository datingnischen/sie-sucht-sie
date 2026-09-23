import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const catalog = JSON.parse(await readFile(new URL("../data/magazine.json", import.meta.url), "utf8"));
const pagesCatalog = JSON.parse(await readFile(new URL("../data/pages.json", import.meta.url), "utf8"));

const entries = catalog.entries;
const attachments = catalog.attachments;
const assets = catalog.assets;
const retired = catalog.retired;

test("magazine landing copy speaks directly to women who love women", async () => {
  const landing = await readFile(new URL("../app/magazin/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(landing, /hilfreiche Einordnungen|neue Perspektiven|für Deine Orientierung|Wissen, Orientierung und Anregungen/i);
  assert.match(landing, /Dating, Liebe und lesbisches Leben/);
  assert.doesNotMatch(landing, /schwul|Männer/i);
});

test("magazine snapshot contains the public editorial inventory without contact ads", () => {
  const posts = entries.filter((entry) => entry.type === "post");
  const pages = entries.filter((entry) => entry.type === "page");
  assert.equal(catalog.sourceCounts.posts - catalog.sourceCounts.retiredContactAds, posts.length);
  assert.equal(catalog.sourceCounts.pages - 2, pages.length);
  assert.ok(posts.length >= 80, `expected the editorial posts, got ${posts.length}`);
  assert.equal(new Set(entries.map((entry) => entry.path)).size, entries.length);
  assert.equal(new Set(attachments.map((entry) => entry.path)).size, attachments.length);
  assert.equal(assets.length, attachments.length);
});

test("contact ads and their category are retired instead of migrated", () => {
  assert.ok(catalog.sourceCounts.retiredContactAds > 300);
  assert.equal(retired.length, catalog.sourceCounts.retiredContactAds + 2);
  const entryPaths = new Set(entries.map((entry) => entry.path));
  for (const item of retired) {
    assert.match(item.path, /^\/magazin\/[^/]+$/);
    assert.equal(item.target, "/magazin");
    assert.ok(!entryPaths.has(item.path), `${item.path} must not also be migrated`);
  }
  assert.ok(retired.some((item) => item.path === "/magazin/kontaktanzeigen-bundeslaender"));
  assert.ok(!catalog.categories.some((category) => category.slug === "kontaktanzeigen"));
  assert.ok(entries.every((entry) => entry.categories.every((category) => category.slug !== "kontaktanzeigen")));
});

test("magazine entries preserve public routes and canonical identity", () => {
  for (const entry of entries) {
    assert.equal(entry.path, `/magazin/${entry.slug}`);
    assert.equal(entry.canonical, `https://www.sie-sucht-sie.de${entry.path}`);
    assert.match(entry.title, /\S/);
    assert.match(entry.description, /\S/);
    assert.match(entry.contentHtml, /\S/);
    assert.equal(entry.status, "publish");
  }
});

test("magazine HTML is static, sanitized and independent of WordPress uploads", async () => {
  const html = entries.map((entry) => entry.contentHtml).join("\n");
  assert.doesNotMatch(html, /<(?:script|style|iframe|form|input|button|object|embed)\b/i);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
  assert.doesNotMatch(html, /(?:src|href)=["'](?:javascript|data|vbscript):/i);
  assert.doesNotMatch(html, /(?:src|href)=["']https?:\/\/(?:www\.)?sie-sucht-sie\.de\/magazin\/wp-content\/uploads/i);
  assert.doesNotMatch(html, /cdn3\.icony-hosting\.de\/user-media/i);
  for (const asset of assets) {
    assert.match(asset.localPath, /^\/magazine\/media\//);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    await access(new URL(`../public${asset.localPath}`, import.meta.url));
  }
});

test("attachments resolve to migrated parent content or localized media", () => {
  const publicPaths = new Set(entries.map((entry) => entry.path));
  const localAssets = new Set(assets.map((asset) => asset.localPath));
  for (const attachment of attachments) {
    assert.ok(
      (attachment.targetType === "entry" && publicPaths.has(attachment.target)) ||
      (attachment.targetType === "asset" && localAssets.has(attachment.target)),
      `${attachment.path} has invalid target ${attachment.target}`,
    );
  }
});

test("menu points to the migrated magazine route", async () => {
  const shell = await readFile(new URL("../components/site-shell.tsx", import.meta.url), "utf8");
  assert.match(shell, /\["Magazin", "\/magazin"\]/);
  assert.doesNotMatch(shell, /sie-sucht-sie\.de\/magazin/);
});

test("snapshot contains no orphaned or excluded member media", () => {
  const renderedMedia = entries.map((entry) => `${entry.featuredImage || ""} ${entry.contentHtml}`).join("\n");
  for (const asset of assets) {
    assert.match(renderedMedia, new RegExp(asset.localPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), asset.localPath);
  }
  assert.deepEqual(assets.filter((asset) => asset.id === 3678), []);
  assert.doesNotMatch(renderedMedia, /\/magazine\/media\/3678-/);
});

test("localized assets preserve exact legacy upload compatibility paths", () => {
  const paths = assets.flatMap((asset) => asset.legacyPaths || []);
  assert.ok(paths.length >= assets.length);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every((path) => path.startsWith("/magazin/wp-content/uploads/")));
});

test("all retained internal magazine links resolve to migrated content or archives", () => {
  const owned = new Set(entries.map((entry) => entry.path));
  const categories = new Set(catalog.categories.map((category) => `/magazin/kategorie/${category.slug}`));
  const unresolved = [];
  for (const entry of entries) {
    for (const match of entry.contentHtml.matchAll(/href="(\/[^"#?]+)["?#]/g)) {
      const path = decodeURI(match[1]).replace(/\/$/, "");
      if (path.startsWith("/magazin/") && !owned.has(path) && !categories.has(path)) {
        unresolved.push([entry.path, path]);
      }
    }
  }
  assert.deepEqual(unresolved, []);
});

test("imported editorial pages link to the migrated magazine instead of WordPress", () => {
  const serialized = JSON.stringify(pagesCatalog.pages);
  assert.doesNotMatch(serialized, /sie-sucht-sie\.de\/magazin/);
});

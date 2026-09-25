import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ABOUT_PAGE_MOVES, ABOUT_REVIEWS_PATH, ABOUT_SOCIAL_PATH, aboutPathForImportedPath, aboutRedirects } from "../lib/about-pages.mjs";
import { buildBreadcrumbs } from "../lib/breadcrumbs.mjs";
import { classifyPath } from "../lib/site-contract.mjs";

const catalog = JSON.parse(readFileSync(new URL("../data/pages.json", import.meta.url), "utf8"));
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("reviews and social media live below the about area", () => {
  assert.equal(aboutPathForImportedPath("/bewertungen-und-erfahrungen"), "/ueber-uns/bewertungen");
  assert.equal(aboutPathForImportedPath("/social-media"), "/ueber-uns/social-media");
  assert.equal(aboutPathForImportedPath("/faq"), "/faq");
});

test("every moved about page exists in the imported catalog", () => {
  const paths = new Set(catalog.pages.map((page) => page.path));
  for (const legacyPath of Object.keys(ABOUT_PAGE_MOVES)) assert.ok(paths.has(legacyPath), legacyPath);
});

test("legacy about URLs redirect permanently to the nested pages", () => {
  assert.deepEqual(aboutRedirects.find((item) => item.source === "/bewertungen-und-erfahrungen"), { source: "/bewertungen-und-erfahrungen", destination: `${ABOUT_REVIEWS_PATH}/`, permanent: true });
  assert.deepEqual(aboutRedirects.find((item) => item.source === "/social-media"), { source: "/social-media", destination: `${ABOUT_SOCIAL_PATH}/`, permanent: true });
  assert.match(read("../next.config.ts"), /\.\.\.aboutRedirects/);
});

test("moved pages keep canonicals on the live brand domain and imported links follow the move", () => {
  const content = read("../lib/content.ts");
  assert.match(content, /withAboutPath/);
  assert.match(content, /ABOUT_PAGE_LINK/);
});

test("about breadcrumbs name the parent area", () => {
  assert.deepEqual(buildBreadcrumbs("/ueber-uns/bewertungen", "Bewertungen").map((item) => item.name), ["Start", "Über uns", "Bewertungen"]);
  assert.deepEqual(buildBreadcrumbs("/ueber-uns/social-media", "Social Media").map((item) => item.path), ["/", "/ueber-uns", "/ueber-uns/social-media"]);
});

test("header and footer link the about area and its subpages", () => {
  const shell = read("../components/site-shell.tsx");
  assert.match(shell, /\["Über uns", ABOUT_ROOT_PATH\]/);
  assert.match(shell, /<FooterColumn title="Über uns" links=\{\[[^\n]*ABOUT_REVIEWS_PATH[^\n]*ABOUT_SOCIAL_PATH/);
  assert.doesNotMatch(shell, /"\/bewertungen-und-erfahrungen"|"\/social-media"/);
});

test("sitemap lists the about hub", () => {
  assert.match(read("../app/sitemap.ts"), /ABOUT_ROOT_PATH/);
});

test("ICONY-served success stories and dating tips stay off the migrated site", () => {
  for (const path of ["/unsere-erfolgsgeschichten.html", "/dating-tipps"]) assert.equal(classifyPath(path), "platform");
  const shell = read("../components/site-shell.tsx");
  const home = read("../app/page.tsx");
  const hub = read("../app/ueber-uns/page.tsx");
  const headerNav = shell.slice(shell.indexOf("const nav = ["), shell.indexOf("] as const;"));
  assert.doesNotMatch(headerNav, /Dating-Tipps/);
  assert.match(shell, /\["Dating-Tipps", platform\.datingTips\]/);
  assert.match(shell, /\["Erfolgsgeschichten", platform\.successStories\]/);
  assert.doesNotMatch(shell + home + hub, /href="\/(dating-tipps|unsere-erfolgsgeschichten\.html)"|"\/dating-tipps"|"\/unsere-erfolgsgeschichten\.html"/);
  assert.doesNotMatch(hub, /Erfolgsgeschichte|successStories|datingTips/);
});

test("ICONY-served trust pages are not rendered as about cards", () => {
  const hub = read("../app/ueber-uns/page.tsx");
  for (const name of ["sicherheit-und-datenschutz", "redaktionelle-kontrolle", "kostenlose-basis-mitgliedschaft", "platform.safety", "platform.editorialControl", "platform.basicMembership"]) {
    assert.ok(!hub.includes(name), `${name} must not appear on the about hub`);
  }
});

test("about pages speak to women and register with an allowed AID", () => {
  const hub = read("../app/ueber-uns/page.tsx");
  const social = read("../app/ueber-uns/social-media/page.tsx");
  assert.doesNotMatch(hub + social, /Männer|Er-sucht-Ihn|schwul/i);
  assert.match(hub, /registrationUrl\(ABOUT_ROOT_PATH\)/);
  assert.equal(classifyPath("/ueber-uns"), "editorial");
});

test("social channels match the imported social media page", () => {
  const page = catalog.pages.find((item) => item.path === "/social-media");
  const channels = read("../lib/social-channels.ts");
  for (const [, href] of channels.matchAll(/href: "([^"]+)"/g)) assert.ok(page.contentHtml.includes(`href="${href}"`), href);
});

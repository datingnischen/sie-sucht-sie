import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { applyTextCorrections, MAGAZINE_CORRECTIONS, PAGE_CORRECTIONS } from "../lib/text-corrections.mjs";

const pages = JSON.parse(readFileSync(new URL("../data/pages.json", import.meta.url), "utf8")).pages;
const entries = JSON.parse(readFileSync(new URL("../data/magazine.json", import.meta.url), "utf8")).entries;
const corrected = (list, table, path) => applyTextCorrections(list.find((item) => item.path === path), table);

test("every correction targets an imported page or entry exactly once", () => {
  for (const path of Object.keys(PAGE_CORRECTIONS)) assert.ok(pages.some((page) => page.path === path), path);
  for (const path of Object.keys(MAGAZINE_CORRECTIONS)) assert.ok(entries.some((entry) => entry.path === path), path);
  for (const page of pages) applyTextCorrections(page, PAGE_CORRECTIONS);
  for (const entry of entries) applyTextCorrections(entry, MAGAZINE_CORRECTIONS);
});

test("a correction whose text vanished from the import fails loudly", () => {
  assert.throws(() => applyTextCorrections({ path: "/x", contentHtml: "neu" }, { "/x": { contentHtml: [["alt", "neu"]] } }), /0 Treffer/);
});

test("the lesbian community entry recommends Sie-sucht-Sie instead of competitors and makes no guarantees", () => {
  const html = corrected(pages, PAGE_CORRECTIONS, "/lexikon/lesbencommunity").contentHtml;
  assert.doesNotMatch(html, /lesarion\.com|de\.lesarion\.com|lesbenschaft\.de|Größter Onlinetreff|garantiert|bei Männern/);
  assert.match(html, /SIE-SUCHT-SIE\.DE – die Community, auf der du gerade bist/);
  assert.match(html, /href="\/magazin"/);
});

test("lexicon pages speak informally and without promises", () => {
  assert.doesNotMatch(corrected(pages, PAGE_CORRECTIONS, "/lexikon").contentHtml, /\b(Ihnen|Ihre?|finden Sie|Entdecken Sie|Werden Sie|Erfahren Sie|Tauschen Sie|Stöbern Sie)\b/);
  for (const path of ["/lexikon/lesbenseiten", "/lexikon/seitensprung-finden"]) {
    assert.doesNotMatch(corrected(pages, PAGE_CORRECTIONS, path).contentHtml, /garantiert/, path);
  }
  assert.doesNotMatch(corrected(pages, PAGE_CORRECTIONS, "/lexikon/die-regenbogenfahne").contentHtml, /Andersartigkeit/);
  assert.doesNotMatch(corrected(pages, PAGE_CORRECTIONS, "/lexikon/fuer-abenteuer").h1, /Heiße/);
});

test("imported typos in city pages are fixed", () => {
  const html = pages.filter((page) => /^\/(partnersuche|schweiz|oesterreich)\//.test(page.path)).map((page) => {
    const fixed = applyTextCorrections(page, PAGE_CORRECTIONS);
    return `${fixed.h1} ${fixed.contentHtml}`;
  }).join("\n");
  assert.doesNotMatch(html, /Winterhur\b|Winterthurç|lebischen|lesvische|Platforme\b|Diese Ort in/);
});

test("the author bio names no other platform and has an alt text", () => {
  const html = corrected(entries, MAGAZINE_CORRECTIONS, "/magazin/christian-m-haas").contentHtml;
  assert.doesNotMatch(html, /er-sucht-ihn/i);
  assert.doesNotMatch(html, /<img alt=""/);
});

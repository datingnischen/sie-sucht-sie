import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/pages.json" with { type: "json" };
import { balanceHtml, buildFaqMainEntity, extractFaq } from "../lib/faq.mjs";
import { removeHeroImageFromContent, selectHeroImage } from "../lib/hero-image.mjs";
import { buildPageEntityGraph } from "../lib/page-entities.mjs";

const faqPage = catalog.pages.find((page) => page.path === "/faq");

test("the FAQ page is split into topic groups with question and answer pairs", () => {
  const faq = extractFaq(faqPage.contentHtml);
  assert.ok(faq);
  assert.equal(faq.groups.length, 7);
  assert.equal(faq.groups.reduce((sum, group) => sum + group.items.length, 0), 21);
  assert.equal(faq.groups[0].title, "Allgemeines über sie-sucht-sie.de");
  assert.equal(faq.groups[0].items[0].question, "An wen richtet sich sie-sucht-sie.de?");
  assert.match(faq.groups[0].items[0].answerHtml, /^<p>Du möchtest neue Frauen kennenlernen/);
  assert.match(faq.afterHtml, /inline-content-cta/);
  assert.doesNotMatch(faq.beforeHtml, /<section>/);
});

test("the fragments around the FAQ accordion are balanced so they hydrate cleanly", () => {
  const faq = extractFaq(faqPage.contentHtml);
  for (const fragment of [faq.beforeHtml, faq.afterHtml]) {
    assert.equal((fragment.match(/<div\b/g) || []).length, (fragment.match(/<\/div>/g) || []).length);
  }
  assert.equal(balanceHtml("<div><p>a</div></div><br/>"), "<div><p>a</p></div><br/>");
});

test("only the FAQ page is rendered as an FAQ accordion", () => {
  const faqPaths = catalog.pages.filter((page) => extractFaq(page.contentHtml)).map((page) => page.path);
  assert.deepEqual(faqPaths, ["/faq"]);
});

test("the FAQ page graph exposes every question as FAQPage schema", () => {
  const faq = extractFaq(faqPage.contentHtml);
  const graph = buildPageEntityGraph(faqPage, { faqEntities: buildFaqMainEntity(faq.groups) });
  const webpage = graph["@graph"].find((node) => node["@id"].endsWith("#webpage"));
  assert.deepEqual(webpage["@type"], ["WebPage", "FAQPage"]);
  assert.equal(webpage.mainEntity.length, 21);
  assert.deepEqual(webpage.mainEntity[3], {
    "@type": "Question",
    name: "Welche Erfahrungen haben Frauen mit sie-sucht-sie.de gemacht?",
    acceptedAnswer: { "@type": "Answer", text: webpage.mainEntity[3].acceptedAnswer.text },
  });
  assert.doesNotMatch(webpage.mainEntity.map((item) => item.acceptedAnswer.text).join(" "), /<|&amp;/);
});

test("the hero image is not repeated inside the article body", () => {
  for (const page of catalog.pages) {
    const hero = selectHeroImage(page.images);
    if (!hero || page.path === "/social-media") continue;
    assert.ok(!removeHeroImageFromContent(page.contentHtml, hero).includes(hero.src), page.path);
  }
  const hero = selectHeroImage(faqPage.images);
  assert.match(removeHeroImageFromContent(faqPage.contentHtml, hero), /^<div> <div> <div> {2}<p>Du interessierst/);
});

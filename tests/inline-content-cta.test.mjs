import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { decorateInlineRegistrationCtas } from "../lib/inline-content-cta.mjs";

const registrationUrl = "https://www.sie-sucht-sie.de/registration/?AID=magazin";

test("registration links inside imported prose become tracked inline CTA buttons", () => {
  const html = '<p><a href="https://www.sie-sucht-sie.de/registration">Chatte jetzt mit Frauen</a></p><p><a href="https://www.sie-sucht-sie.de/registration/">Jetzt kostenlos registrieren</a></p>';
  const result = decorateInlineRegistrationCtas(html, registrationUrl);
  assert.match(result, new RegExp(`href="${registrationUrl.replace(/[?]/g, "\\?")}" class="inline-content-cta"`));
  assert.equal((result.match(/class="inline-content-cta"/g) || []).length, 2);
});

test("ordinary editorial links remain ordinary text links", () => {
  const editorial = '<a href="https://www.sie-sucht-sie.de/magazin/lesbische-beziehung">eine harmonische Beziehung</a>';
  assert.equal(decorateInlineRegistrationCtas(editorial, registrationUrl), editorial);
});

test("empty and image-only registration anchors are not turned into blank buttons", () => {
  const html = '<a href="https://www.sie-sucht-sie.de/registration"><img src="/promo.jpg" alt="" /></a><a href="https://www.sie-sucht-sie.de/registration"></a>';
  assert.equal(decorateInlineRegistrationCtas(html, registrationUrl), html);
});

test("anchor-shaped text outside safe prose anchors is preserved byte-for-byte", () => {
  const cases = [
    '<!-- <a href="https://www.sie-sucht-sie.de/registration">fake</a> -->',
    '<script>const x = `<a href="https://www.sie-sucht-sie.de/registration">fake</a>`;</script>',
    '<textarea><a href="https://www.sie-sucht-sie.de/registration">fake</a></textarea>',
    '<div title="<a href=\'https://www.sie-sucht-sie.de/registration\'>fake</a>">Text</div>',
    '<a data-href="https://www.sie-sucht-sie.de/registration" href="/ordinary">ordinary</a>',
    '<a href="https://www.sie-sucht-sie.de/registration"><button>nested</button></a>',
  ];
  for (const html of cases) assert.equal(decorateInlineRegistrationCtas(html, registrationUrl), html);
});

test("malformed anchors fail closed without mutation", () => {
  const html = '<p><a href="https://www.sie-sucht-sie.de/registration">unfinished';
  assert.equal(decorateInlineRegistrationCtas(html, registrationUrl), html);
});

test("inline CTA styling is button-like, keyboard-visible and mobile-safe", () => {
  const css = fs.readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.rich-content a\.inline-content-cta\s*\{[^}]*display:inline-flex[^}]*background:/i);
  assert.match(css, /\.rich-content a\.inline-content-cta:focus-visible\s*\{[^}]*outline:/i);
  assert.match(css, /\.inline-content-cta\s*\{[^}]*max-width:100%[^}]*text-align:center/i);
});

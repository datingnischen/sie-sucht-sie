import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyPath,
  getLocationName,
  getRegistrationUrl,
  isMigratedPath,
  legalLinks,
  routeFamilies,
} from "../lib/site-contract.mjs";

test("location routes receive location conversion tracking", () => {
  for (const path of ["/partnersuche/berlin", "/oesterreich/wien", "/schweiz/zuerich"]) {
    assert.equal(classifyPath(path), "location");
    assert.equal(getRegistrationUrl(path), "https://www.sie-sucht-sie.de/registration/?AID=location");
  }
});

test("editorial routes receive magazine conversion tracking", () => {
  for (const path of ["/", "/dating-tipps", "/lexikon/lesbenseiten"]) {
    assert.equal(getRegistrationUrl(path), "https://www.sie-sucht-sie.de/registration/?AID=magazin");
  }
});

test("location names come from public route slugs instead of editorial headlines", () => {
  assert.equal(getLocationName("/partnersuche/frankfurt-am-main"), "Frankfurt am Main");
  assert.equal(getLocationName("/partnersuche/muenchen"), "München");
  assert.equal(getLocationName("/schweiz/zuerich"), "Zürich");
});

test("legal and platform links stay on the live ICONY market", () => {
  assert.deepEqual(legalLinks, {
    datenschutz: "https://www.sie-sucht-sie.de/datenschutz.html",
    impressum: "https://www.sie-sucht-sie.de/impressum.html",
    agb: "https://www.sie-sucht-sie.de/agb.html",
  });
});

test("migration contract covers all public editorial route families", () => {
  assert.deepEqual(routeFamilies, ["partnersuche", "oesterreich", "schweiz", "lexikon"]);
  assert.equal(isMigratedPath("/partnersuche/berlin"), true);
  assert.equal(isMigratedPath("/registration"), false);
  assert.equal(isMigratedPath("/login"), false);
});

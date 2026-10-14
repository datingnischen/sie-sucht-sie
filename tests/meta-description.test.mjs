import test from "node:test";
import assert from "node:assert/strict";
import { clampMetaDescription, META_DESCRIPTION_MAX } from "../lib/meta-description.mjs";

test("short descriptions stay unchanged apart from whitespace", () => {
  assert.equal(clampMetaDescription("  Kurz und   bündig. "), "Kurz und bündig.");
});

test("long descriptions are cut at the last sentence end when it is long enough", () => {
  const text = "Die Lesbenflagge erklärt: Was die Regenbogenfahne für Lesben bedeutet und warum es Varianten mit sechs Streifen gibt. Woher das Symbol stammt, liest du hier ausführlich im Artikel.";
  const result = clampMetaDescription(text);
  assert.ok(result.length <= META_DESCRIPTION_MAX);
  assert.ok(result.endsWith("sechs Streifen gibt."));
});

test("otherwise long descriptions end on a whole word with an ellipsis", () => {
  const text = "Ursprung Primär und ursprünglich kann man es als seltsam oder merkwürdig übersetzen und erst später im neunzehnten Jahrhundert wurde es im Themenbereich der Sexualität verwendet und so weiter";
  const result = clampMetaDescription(text);
  assert.ok(result.length <= META_DESCRIPTION_MAX);
  assert.match(result, /\S …$/);
  assert.ok(text.startsWith(result.slice(0, -2)));
});

test("trailing WordPress ellipsis is dropped before measuring", () => {
  assert.equal(clampMetaDescription("Ein kurzer Auszug..."), "Ein kurzer Auszug");
});

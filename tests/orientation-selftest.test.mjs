import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAnswers, buildShareData, questions, results } from '../lib/orientation-selftest.mjs';

test('incomplete and invalid answers never produce an interpretation', () => {
  for (const answers of [[], Array(7).fill('yes'), Array(9).fill('no'), Array(8).fill('invalid'), Array(8)]) {
    assert.equal(evaluateAnswers(answers), null);
  }
});

test('uncertainty is not counted as lack of attraction', () => {
  assert.equal(evaluateAnswers(Array(8).fill('unsure'))?.id, 'exploring');
  assert.equal(evaluateAnswers(Array(8).fill('no'))?.id, 'little');
});

test('results describe self-reported patterns, with no assigned identity or probability', () => {
  assert.equal(evaluateAnswers(['yes','yes','yes','no','no','no','no','yes'])?.id, 'women');
  assert.equal(evaluateAnswers(Array(8).fill('yes'))?.id, 'several');
  assert.equal(evaluateAnswers(['no','no','no','yes','yes','yes','no','no'])?.id, 'other');
  assert.equal(evaluateAnswers(['yes','no','unsure','no','no','unsure','yes','no'])?.id, 'exploring');
  for (const result of Object.values(results)) assert.doesNotMatch(result.title, /\d|Du bist (lesbisch|bi|hetero)/i);
  assert.equal(questions.length, 8);
});

test('sharing is neutral by default and never puts answers or results in a URL', () => {
  const result = evaluateAnswers(Array(8).fill('yes'));
  const neutral = buildShareData(result);
  const explicit = buildShareData(result, true);
  assert.ok(!neutral.text.includes(result.title));
  assert.ok(explicit.text.includes(result.title));
  assert.equal(neutral.url, 'https://www.sie-sucht-sie.de/magazin/bin-ich-lesbisch/#selbsttest');
  assert.equal(explicit.url, neutral.url);
  assert.ok(!neutral.url.includes('?'));
});

test('each question offers contextual answers with the same transparent evaluation meaning', () => {
  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.deepEqual(question.options.map(option => option.value), ['yes','sometimes','no','unsure']);
    assert.ok(question.options.every(option => option.detail.length > 15));
  }
  assert.equal(new Set(questions.map(question => question.options[0].label)).size, 8);
});

test('the assessment reflects different romantic, physical and relationship answers separately', () => {
  const result = evaluateAnswers(['yes','no','yes','no','unsure','no','yes','sometimes']);
  assert.equal(result.facets.length, 3);
  assert.equal(result.facets[0].womenAnswer, 'yes');
  assert.equal(result.facets[1].womenAnswer, 'no');
  assert.equal(result.facets[1].otherAnswer, 'unsure');
  assert.notEqual(result.facets[0].text, result.facets[1].text);
  assert.ok(result.context.length > 200);
  assert.ok(result.nextStep.length > 150);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffBinary } from '../src/core/diffBinary.js';
import { SEGMENT_TYPES } from '../src/core/model.js';

function types(model, cellIndex = 0) {
  return model.cells[cellIndex].segments.map((s) => `${s.type}:${s.text}`);
}

test('scalaire: detecte insertion et remplacement', () => {
  const model = diffBinary("J'aime les patates", "J'aime bien les carottes");
  assert.equal(model.shape, 'scalar');
  const added = model.cells[0].segments.filter((s) => s.type === SEGMENT_TYPES.ADDED);
  const removed = model.cells[0].segments.filter((s) => s.type === SEGMENT_TYPES.REMOVED);
  assert.ok(added.some((s) => s.text.includes('bien')), 'bien ajoute');
  assert.ok(added.some((s) => s.text.includes('carottes')), 'carottes ajoute');
  assert.ok(removed.some((s) => s.text.includes('patates')), 'patates supprime');
});

test('identique: tout en equal', () => {
  const model = diffBinary('Col 1', 'Col 1');
  assert.deepEqual(types(model), ['equal:Col 1']);
});

test('conserve le prefixe commun', () => {
  const model = diffBinary("J'aime les patates", "J'aime bien les carottes");
  assert.equal(model.cells[0].segments[0].type, SEGMENT_TYPES.EQUAL);
  assert.ok(model.cells[0].segments[0].text.startsWith("J'aime"));
});

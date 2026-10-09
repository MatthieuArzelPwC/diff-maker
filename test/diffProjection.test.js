import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffProjection } from '../src/core/diffProjection.js';
import { SEGMENT_TYPES } from '../src/core/model.js';

function changedText(model, cellIndex = 0) {
  return model.cells[cellIndex].segments
    .filter((s) => s.type === SEGMENT_TYPES.CHANGED)
    .map((s) => s.text)
    .join('|');
}

test('projette l union des modifications de plusieurs versions sur V1', () => {
  const v1 = "J'aime les patates";
  const model = diffProjection(v1, [
    "J'aime bien les carottes",
    "J'adore bien les pommes",
  ]);
  assert.equal(model.shape, 'scalar');
  const changed = changedText(model);
  // "J'aime" modifie par v3 (J'adore), "patates" modifie par les deux.
  assert.ok(changed.includes('patates'), 'patates surligne');
  assert.ok(changed.includes("J'aime") || changed.includes('aime'), "J'aime surligne par v3");
});

test('une version identique ne surligne rien', () => {
  const model = diffProjection('Col 1', ['Col 1']);
  const changed = model.cells[0].segments.filter((s) => s.type === SEGMENT_TYPES.CHANGED);
  assert.equal(changed.length, 0);
});

test('version unique non-tableau est traitee comme liste a 1 element', () => {
  const model = diffProjection('Col 1', 'Col B');
  assert.ok(changedText(model).length > 0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffBinary } from '../src/core/diffBinary.js';
import { diffProjection } from '../src/core/diffProjection.js';
import { SEGMENT_TYPES } from '../src/core/model.js';

// Cas n3 de test.json : colonnes, V3 perd "Col 2".
const V1 = ['Col 1', 'Col 2', 'Col 3'];
const V2 = ['Col 1', 'Col B', 'Col 3'];
const V3 = ['Col 1', 'Col 3'];

test('binaire tableau: forme array conservee', () => {
  const model = diffBinary(V1, V2);
  assert.equal(model.shape, 'array');
  assert.equal(model.cells.length, 3);
});

test('binaire tableau: cellule modifiee detectee (Col 2 -> Col B)', () => {
  const model = diffBinary(V1, V2);
  const flat = model.cells
    .flatMap((c) => c.segments)
    .map((s) => `${s.type}:${s.text}`);
  assert.ok(flat.some((x) => x === `${SEGMENT_TYPES.REMOVED}:2`));
  assert.ok(flat.some((x) => x === `${SEGMENT_TYPES.ADDED}:B`));
});

test('binaire tableau: colonne supprimee (V1 -> V3)', () => {
  const model = diffBinary(V1, V3);
  const removed = model.cells
    .flatMap((c) => c.segments)
    .filter((s) => s.type === SEGMENT_TYPES.REMOVED)
    .map((s) => s.text)
    .join('');
  assert.ok(removed.includes('Col 2'), 'Col 2 marquee supprimee');
});

test('projection tableau: V1 vs [V2, V3] surligne Col 2', () => {
  const model = diffProjection(V1, [V2, V3]);
  assert.equal(model.shape, 'array');
  const changed = model.cells
    .flatMap((c) => c.segments)
    .filter((s) => s.type === SEGMENT_TYPES.CHANGED)
    .map((s) => s.text)
    .join('|');
  assert.ok(changed.includes('2') || changed.includes('Col 2'), 'Col 2 surlignee');
});

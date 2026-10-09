import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHtml } from '../src/render/html.js';
import { computeDiffHtml } from '../src/core/index.js';
import { SEGMENT_TYPES } from '../src/core/model.js';

test('echappe le HTML des donnees', () => {
  const model = {
    shape: 'scalar',
    cells: [{ segments: [{ text: '<script>&"\'', type: SEGMENT_TYPES.EQUAL }] }],
  };
  const html = renderHtml(model, 'wwdiff');
  assert.ok(!html.includes('<script>'), 'balise script neutralisee');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&amp;'));
  assert.ok(html.includes('&quot;'));
  assert.ok(html.includes('&#39;'));
});

test('emet des classes prefixees, sans style inline', () => {
  const html = computeDiffHtml({
    original: 'a b',
    modified: 'a c',
    mode: 'redgreen',
    classPrefix: 'wwdiff',
  });
  assert.ok(html.includes('class="wwdiff-equal"'));
  assert.ok(html.includes('class="wwdiff-added"') || html.includes('class="wwdiff-removed"'));
  assert.ok(!html.includes('style='), 'aucun style inline');
});

test('rendu tableau: cellules et separateurs', () => {
  const html = computeDiffHtml({
    original: ['Col 1', 'Col 2'],
    modified: ['Col 1', 'Col B'],
    mode: 'redgreen',
    classPrefix: 'wwdiff',
  });
  assert.ok(html.includes('wwdiff-cell'));
  assert.ok(html.includes('wwdiff-sep'));
});

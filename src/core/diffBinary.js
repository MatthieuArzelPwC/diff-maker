import { diffArrays } from 'diff';
import { normalizeVersion } from './normalize.js';
import { tokenize } from './segment.js';
import { alignCells } from './align.js';
import { SEGMENT_TYPES } from './model.js';

/**
 * Mode rouge/vert : diff binaire entre `original` (V1) et `modified` (V2).
 *
 * Produit une vue inline montrant les suppressions (removed, rouge) et les
 * insertions (added, vert), mot a mot. L'alignement de cellules gere les
 * versions-tableau de longueurs differentes.
 *
 * @param {unknown} original
 * @param {unknown} modified
 * @param {string} [lang='fr']
 * @returns {import('./model.js').DiffModel}
 */
export function diffBinary(original, modified, lang = 'fr') {
  const a = normalizeVersion(original);
  const b = normalizeVersion(modified);
  const shape = a.shape === 'array' || b.shape === 'array' ? 'array' : 'scalar';

  const pairs = alignCells(a.cells, b.cells);
  const cells = pairs.map((pair) => ({
    segments: diffCellBinary(pair.original, pair.modified, lang),
  }));

  return { shape, cells };
}

function diffCellBinary(originalText, modifiedText, lang) {
  if (originalText === null) {
    // Cellule entierement ajoutee cote version.
    return modifiedText
      ? [{ text: modifiedText, type: SEGMENT_TYPES.ADDED }]
      : [];
  }
  if (modifiedText === null) {
    // Cellule entierement supprimee.
    return originalText
      ? [{ text: originalText, type: SEGMENT_TYPES.REMOVED }]
      : [];
  }

  const tokensA = tokenize(originalText, lang);
  const tokensB = tokenize(modifiedText, lang);
  const parts = diffArrays(tokensA, tokensB);

  const segments = [];
  for (const part of parts) {
    const type = part.added
      ? SEGMENT_TYPES.ADDED
      : part.removed
        ? SEGMENT_TYPES.REMOVED
        : SEGMENT_TYPES.EQUAL;
    const text = part.value.join('');
    if (text) segments.push({ text, type });
  }
  return segments;
}

/**
 * API publique du coeur de calcul (framework-agnostique).
 *
 * Point d'entree unique : `computeDiffHtml` orchestre normalisation, diff et
 * rendu selon le mode. Utilisable cote composant WeWeb comme cote tests/serveur.
 */
import { diffBinary } from './diffBinary.js';
import { diffProjection } from './diffProjection.js';
import { renderHtml } from '../render/html.js';

export { diffBinary } from './diffBinary.js';
export { diffProjection } from './diffProjection.js';
export { renderHtml } from '../render/html.js';
export { SEGMENT_TYPES } from './model.js';

/**
 * Calcule le modele de diff selon le mode.
 * @param {unknown} original
 * @param {unknown} modified
 * @param {'redgreen' | 'orange'} mode
 * @param {string} [lang='fr']
 * @returns {import('./model.js').DiffModel}
 */
export function computeDiff(original, modified, mode, lang = 'fr') {
  if (mode === 'orange') {
    return diffProjection(original, modified, lang);
  }
  return diffBinary(original, modified, lang);
}

/**
 * Calcule et rend directement le HTML (echappe) pret a etre injecte.
 * @param {Object} params
 * @param {unknown} params.original
 * @param {unknown} params.modified
 * @param {'redgreen' | 'orange'} params.mode
 * @param {string} [params.lang='fr']
 * @param {string} [params.classPrefix='wwdiff']
 * @returns {string}
 */
export function computeDiffHtml({ original, modified, mode, lang = 'fr', classPrefix = 'wwdiff' }) {
  const model = computeDiff(original, modified, mode, lang);
  return renderHtml(model, classPrefix);
}

/**
 * Modele de tokens produit par le coeur de calcul.
 *
 * Le coeur est volontairement agnostique du framework (pas de Vue, pas de DOM).
 * Il produit une structure de donnees que le renderer transforme ensuite en
 * HTML. Cette separation rend le calcul testable et reutilisable (serveur ou
 * client).
 *
 * @typedef {'equal' | 'added' | 'removed' | 'changed'} SegmentType
 *   - equal   : fragment identique entre les versions
 *   - added   : fragment present uniquement dans la version modifiee (vert)
 *   - removed : fragment present uniquement dans l'original (rouge)
 *   - changed : fragment de l'original touche par au moins une version (orange)
 *
 * @typedef {Object} Segment
 * @property {string} text      texte brut (non echappe) du fragment
 * @property {SegmentType} type nature du fragment
 *
 * @typedef {Object} Cell
 * @property {Segment[]} segments fragments ordonnes de la cellule
 *
 * @typedef {Object} DiffModel
 * @property {'scalar' | 'array'} shape forme d'origine (chaine ou tableau)
 * @property {Cell[]} cells cellules rendues dans l'ordre
 */

export const SEGMENT_TYPES = Object.freeze({
  EQUAL: 'equal',
  ADDED: 'added',
  REMOVED: 'removed',
  CHANGED: 'changed',
});

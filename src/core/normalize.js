/**
 * Normalisation des entrees heterogenes ("any").
 *
 * Une version peut etre une chaine simple, un tableau de cellules/colonnes,
 * un nombre, un booleen ou un objet. Pour unifier le traitement en aval, on
 * represente toute version comme un tableau de cellules (`string[]`) et on
 * memorise sa forme d'origine pour piloter le rendu.
 */

/**
 * @typedef {Object} NormalizedVersion
 * @property {'scalar' | 'array'} shape forme d'origine
 * @property {string[]} cells cellules normalisees (toujours un tableau)
 */

/**
 * Coerce une valeur quelconque vers du texte.
 * - null / undefined -> ""
 * - primitive (string, number, boolean) -> String(value)
 * - objet non-array -> JSON.stringify (fallback lisible)
 * @param {unknown} value
 * @returns {string}
 */
export function toText(value) {
  if (value == null) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * Normalise une version (any) vers une representation uniforme.
 * @param {unknown} value
 * @returns {NormalizedVersion}
 */
export function normalizeVersion(value) {
  if (Array.isArray(value)) {
    return { shape: 'array', cells: value.map(toText) };
  }
  return { shape: 'scalar', cells: [toText(value)] };
}

/**
 * Normalise la prop `modified` en mode projection (orange), ou elle represente
 * une LISTE de versions. Si `modified` n'est pas un tableau de versions, on
 * l'enveloppe en liste a un element.
 *
 * Ambiguite tranchee par le mode : en mode orange, un tableau est toujours
 * interprete comme une liste de versions. Chaque version peut elle-meme etre
 * une chaine ou un tableau de colonnes.
 * @param {unknown} value
 * @returns {NormalizedVersion[]}
 */
export function normalizeVersionList(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return value.map(normalizeVersion);
  }
  return [normalizeVersion(value)];
}

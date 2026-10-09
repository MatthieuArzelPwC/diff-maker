/**
 * Tokenisation en mots via Intl.Segmenter (standard ECMA-402).
 *
 * On decoupe le texte en segments conscients de la locale (gere les
 * apostrophes type "J'aime", les accents, la ponctuation et les graphemes).
 * Contrairement a une regex maison, c'est un standard du langage, natif dans
 * Node et les navigateurs modernes : argument d'architecture fort.
 *
 * On CONSERVE les segments non-mots (espaces, ponctuation) afin de pouvoir
 * reconstruire fidelement le texte apres diff, sans perdre la mise en forme.
 */

const segmenterCache = new Map();

function getSegmenter(lang) {
  const key = lang || 'fr';
  let seg = segmenterCache.get(key);
  if (!seg) {
    seg = new Intl.Segmenter(key, { granularity: 'word' });
    segmenterCache.set(key, seg);
  }
  return seg;
}

/**
 * Decoupe un texte en tokens (mots + separateurs conserves).
 * @param {string} text
 * @param {string} [lang='fr']
 * @returns {string[]}
 */
export function tokenize(text, lang = 'fr') {
  if (!text) return [];
  const segmenter = getSegmenter(lang);
  const tokens = [];
  for (const { segment } of segmenter.segment(text)) {
    tokens.push(segment);
  }
  return tokens;
}

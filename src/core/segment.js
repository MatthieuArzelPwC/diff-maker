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

const DEFAULT_LANG = 'fr';

/**
 * Construit (et memorise) un Segmenter pour la locale demandee.
 *
 * `lang` est une prop bindable : une valeur invalide ("", "xx_YY!!", un objet
 * coerce) ferait lever un RangeError a Intl.Segmenter et casserait le rendu du
 * composant. On retombe donc sur la locale par defaut, puis sur la locale
 * neutre, plutot que de propager l'erreur.
 */
function getSegmenter(lang) {
  const key = typeof lang === 'string' && lang ? lang : DEFAULT_LANG;
  let seg = segmenterCache.get(key);
  if (!seg) {
    seg = createSegmenter(key);
    segmenterCache.set(key, seg);
  }
  return seg;
}

function createSegmenter(key) {
  try {
    return new Intl.Segmenter(key, { granularity: 'word' });
  } catch {
    try {
      return new Intl.Segmenter(DEFAULT_LANG, { granularity: 'word' });
    } catch {
      return new Intl.Segmenter(undefined, { granularity: 'word' });
    }
  }
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

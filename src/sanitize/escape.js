/**
 * Echappement HTML.
 *
 * Les entrees sont "any" et potentiellement non fiables. On echappe les
 * caracteres sensibles AVANT toute construction de balise, afin de neutraliser
 * toute injection. Le renderer n'insere ensuite que des classes (aucun style
 * ni contenu non echappe).
 *
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

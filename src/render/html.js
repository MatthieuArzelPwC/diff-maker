import { escapeHtml } from '../sanitize/escape.js';

/**
 * Rendu du modele de diff en chaine HTML.
 *
 * Regles :
 * - tout texte est echappe AVANT insertion (securite) ;
 * - uniquement des classes CSS, aucun style inline (l'utilisateur stylise) ;
 * - cellules multiples (tableaux) separees par un span neutre ;
 * - racine non incluse ici : le composant Vue fournit le conteneur racine.
 *
 * Classes emises (prefixe configurable, defaut "wwdiff") :
 *   {p}-cell {p}-sep {p}-equal {p}-added {p}-removed {p}-changed
 *
 * @param {import('../core/model.js').DiffModel} model
 * @param {string} [prefix='wwdiff']
 * @returns {string}
 */
export function renderHtml(model, prefix = 'wwdiff') {
  if (!model || !Array.isArray(model.cells)) return '';

  const cellsHtml = model.cells.map((cell) => renderCell(cell, prefix));

  if (model.shape === 'array') {
    const sep = `<span class="${prefix}-sep"></span>`;
    return cellsHtml
      .map((html) => `<span class="${prefix}-cell">${html}</span>`)
      .join(sep);
  }

  return cellsHtml.join('');
}

function renderCell(cell, prefix) {
  if (!cell || !Array.isArray(cell.segments)) return '';
  return cell.segments
    .map(
      (seg) =>
        `<span class="${prefix}-${seg.type}">${escapeHtml(seg.text)}</span>`,
    )
    .join('');
}

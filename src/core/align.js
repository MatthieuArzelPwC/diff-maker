import { diffArrays } from 'diff';

/**
 * Alignement de cellules (colonnes) entre deux versions-tableau.
 *
 * Quand `original` et une version comparee ont des longueurs differentes
 * (ex: une colonne supprimee), on aligne d'abord au niveau cellule avec
 * l'algorithme de Myers (diffArrays) avant de comparer le contenu mot a mot.
 *
 * @typedef {Object} CellPair
 * @property {string | null} original cellule cote original (null si absente)
 * @property {string | null} modified cellule cote version (null si absente)
 *
 * @param {string[]} originalCells
 * @param {string[]} modifiedCells
 * @returns {CellPair[]}
 */
export function alignCells(originalCells, modifiedCells) {
  const parts = diffArrays(originalCells, modifiedCells);
  const pairs = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (!part.added && !part.removed) {
      for (const value of part.value) {
        pairs.push({ original: value, modified: value });
      }
      continue;
    }

    // Un bloc "removed" suivi d'un bloc "added" = remplacement de cellules.
    // On les apparie positionnellement pour produire un diff intra-cellule.
    if (part.removed) {
      const next = parts[i + 1];
      if (next && next.added) {
        const max = Math.max(part.value.length, next.value.length);
        for (let k = 0; k < max; k++) {
          pairs.push({
            original: k < part.value.length ? part.value[k] : null,
            modified: k < next.value.length ? next.value[k] : null,
          });
        }
        i++; // bloc "added" consomme
        continue;
      }
      for (const value of part.value) {
        pairs.push({ original: value, modified: null });
      }
      continue;
    }

    // part.added seul : cellules ajoutees cote version.
    for (const value of part.value) {
      pairs.push({ original: null, modified: value });
    }
  }

  return pairs;
}

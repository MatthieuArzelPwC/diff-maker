import { diffArrays } from 'diff';
import { normalizeVersion, normalizeVersionList } from './normalize.js';
import { tokenize } from './segment.js';
import { alignCells } from './align.js';
import { SEGMENT_TYPES } from './model.js';

/**
 * Mode projection orange : `original` (V1) compare a une LISTE de versions.
 *
 * Ce n'est pas un diff n-way (qui n'existe pas nativement), mais une
 * projection : pour chaque version on calcule un diff binaire pairwise avec
 * V1, on marque les tokens de V1 touches (supprimes/remplaces, ou voisins
 * d'une insertion), puis on fait l'UNION des masques de toutes les versions.
 * Le rendu est V1 avec ses tokens touches en `changed` (orange).
 *
 * Generalise a N versions sans combinatoire : N diffs binaires + union.
 *
 * @param {unknown} original
 * @param {unknown} modifiedList liste de versions (ou version unique)
 * @param {string} [lang='fr']
 * @returns {import('./model.js').DiffModel}
 */
export function diffProjection(original, modifiedList, lang = 'fr') {
  const ref = normalizeVersion(original);
  const versions = normalizeVersionList(modifiedList);

  // Un masque de tokens par cellule de reference. Pre-tokenise une seule fois.
  const refTokens = ref.cells.map((text) => tokenize(text, lang));
  const masks = refTokens.map((tokens) => new Array(tokens.length).fill(false));
  const cellRemoved = new Array(ref.cells.length).fill(false);

  for (const version of versions) {
    projectVersion(ref.cells, version.cells, lang, refTokens, masks, cellRemoved);
  }

  const cells = ref.cells.map((_, i) =>
    buildCell(refTokens[i], masks[i], cellRemoved[i]),
  );

  return { shape: ref.shape, cells };
}

function projectVersion(refCells, versionCells, lang, refTokens, masks, cellRemoved) {
  const pairs = alignCells(refCells, versionCells);
  let refIndex = -1;

  for (const pair of pairs) {
    if (pair.original === null) {
      // Colonne ajoutee cote version : insertion sans contrepartie dans V1.
      // On marque la frontiere sur la cellule de reference la plus proche.
      // Si V1 n'a aucune cellule (binding vide/pas encore charge), il n'y a
      // rien a surligner : on ignore l'insertion.
      const target = refIndex >= 0 ? refIndex : 0;
      if (masks[target]) markBoundary(masks[target]);
      continue;
    }

    refIndex++;

    if (pair.modified === null) {
      // Cellule de V1 supprimee dans cette version.
      cellRemoved[refIndex] = true;
      masks[refIndex].fill(true);
      continue;
    }

    projectTokens(refTokens[refIndex], pair.modified, lang, masks[refIndex]);
  }
}

function projectTokens(tokensRef, modifiedText, lang, mask) {
  const tokensVer = tokenize(modifiedText, lang);
  const parts = diffArrays(tokensRef, tokensVer);

  let refIndex = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.removed) {
      for (let k = 0; k < part.value.length; k++) mask[refIndex++] = true;
      continue;
    }
    if (part.added) {
      // Insertion pure (non precedee d'une suppression deja marquee) :
      // on surligne le token de reference voisin de la frontiere.
      const prev = parts[i - 1];
      if (!prev || !prev.removed) {
        if (refIndex < mask.length) mask[refIndex] = true;
        else if (refIndex > 0) mask[refIndex - 1] = true;
      }
      continue;
    }
    // equal : on avance sans marquer.
    refIndex += part.value.length;
  }
}

function markBoundary(mask) {
  if (mask.length > 0) mask[mask.length - 1] = true;
}

function buildCell(tokens, mask, removed) {
  if (removed) {
    const text = tokens.join('');
    return { segments: text ? [{ text, type: SEGMENT_TYPES.CHANGED }] : [] };
  }

  const segments = [];
  let buffer = '';
  let bufferChanged = null;

  const flush = () => {
    if (buffer) {
      segments.push({
        text: buffer,
        type: bufferChanged ? SEGMENT_TYPES.CHANGED : SEGMENT_TYPES.EQUAL,
      });
    }
    buffer = '';
  };

  for (let i = 0; i < tokens.length; i++) {
    const changed = mask[i];
    if (bufferChanged === null || changed === bufferChanged) {
      buffer += tokens[i];
      bufferChanged = changed;
    } else {
      flush();
      buffer = tokens[i];
      bufferChanged = changed;
    }
  }
  flush();

  return { segments };
}

/**
 * Cas de reference partages par les tests.
 *
 * 1. scalaire : chaines simples (apostrophes, accents)
 * 2. tableau a une cellule : meme contenu que 1, forme "array"
 * 3. tableau multi-colonnes : V2 remplace une colonne, V3 en supprime une
 */
export const CASES = [
  {
    v1: "J'aime les patates",
    v2: "J'aime bien les carottes",
    v3: "J'adore bien les pommes",
  },
  {
    v1: ["J'aime les patates"],
    v2: ["J'aime bien les carottes"],
    v3: ["J'adore bien les pommes"],
  },
  {
    v1: ['Col 1', 'Col 2', 'Col 3'],
    v2: ['Col 1', 'Col B', 'Col 3'],
    v3: ['Col 1', 'Col 3'],
  },
];

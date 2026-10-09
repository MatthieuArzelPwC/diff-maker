# ww-diff-maker

WeWeb **coded component** (Vue 3) qui compare des chaines de caracteres et rend
un HTML surligne. Deux modes :

- **Rouge/Vert** (`redgreen`) : diff binaire entre `original` (V1) et `modified`
  (V2). Suppressions en rouge, insertions en vert.
- **Orange** (`orange`) : projection de `original` (V1) contre une **liste** de
  versions (`modified` = `[V2, V3, ...]`). Tout mot de V1 modifie/supprime dans
  au moins une version est surligne ; une insertion surligne le mot voisin.

## Fondations techniques (standards)

- **Algorithme de Myers (1986)** via [`jsdiff`](https://www.npmjs.com/package/diff)
  (`diffArrays`) — le standard utilise par `git`, Google Docs, etc. Jamais
  reimplemente maison.
- **Segmentation en mots** via
  [`Intl.Segmenter`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  (standard **ECMA-402**, natif Node/navigateur, locale-aware : gere `J'aime`,
  accents, ponctuation).
- **Coeur de calcul pur** (sans Vue/DOM) separe du **renderer** : testable,
  reutilisable serveur ou client.

## Proprietes du composant

| Prop | Type | Bindable | Role |
|---|---|---|---|
| `original` | any | oui | Version de reference V1 (string, nombre, ou `string[]` de colonnes). |
| `modified` | any | oui | `redgreen` : une version. `orange` : liste de versions. |
| `mode` | select | — | `redgreen` (defaut) ou `orange`. |
| `lang` | text | oui | Locale `Intl.Segmenter` (defaut `fr`). |
| `classPrefix` | text | — | Prefixe des classes CSS (defaut `wwdiff`). |

Le **mode dicte l'interpretation** de `modified` : en `orange`, un tableau est
toujours une liste de versions ; en `redgreen`, un tableau est une seule version
a colonnes.

## Sortie & styles

Le composant produit du HTML **echappe** (securise) assemble en `<span>` avec des
**classes uniquement** (aucun style inline). Vous fournissez le CSS.

Classes emises :

```
{prefix}-root      conteneur racine
{prefix}-cell      une cellule/colonne (mode tableau)
{prefix}-sep       separateur entre cellules
{prefix}-equal     fragment inchange
{prefix}-added     insertion (vert)      [mode redgreen]
{prefix}-removed   suppression (rouge)   [mode redgreen]
{prefix}-changed   fragment modifie (orange) [mode orange]
```

Exemple de CSS : voir `demo/index.html`.

## Coercion des entrees « any »

- `null` / `undefined` -> `""`
- primitive (number, boolean) -> `String(value)`
- `Array` -> liste de cellules/colonnes
- objet non-array -> `JSON.stringify(value)`

## Comportement du mode orange

Comme une insertion n'a pas de contrepartie dans V1, elle surligne le mot de V1
**voisin** de la frontiere d'insertion (signal « quelque chose a ete insere
ici »). Les suppressions/remplacements surlignent directement le mot de V1. Le
masque final est l'**union** sur toutes les versions.

## Structure

```
ww-config.js            declaration des proprietes (editeur WeWeb)
src/wwElement.vue       composant Vue (racine unique, v-html echappe)
src/core/               coeur pur : normalize, segment, align, diffBinary,
                        diffProjection, model, index (API publique)
src/render/html.js      modele -> HTML (spans + classes)
src/sanitize/escape.js  echappement HTML
test/                   tests node:test (node --test)
demo/                   run.js (console) + index.html (visuel)
data/test.json          cas de reference
```

## Developpement

```bash
npm install
npm test          # tests unitaires du coeur (13)
npm run demo      # rend les 3 cas de test.json en console
```

Ouvrir `demo/index.html` dans un navigateur pour la vue stylisee.

Chargement dans l'editeur WeWeb : suivre le process coded component
(serve local du composant puis import dans l'editeur).

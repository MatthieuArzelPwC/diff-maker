export default {
  editor: {
    label: {
      en: "Text Diff",
      fr: "Comparateur de texte",
    },
    icon: "git-compare",
  },
  triggerEvents: [],
  properties: {
    original: {
      label: { en: "Original (V1)", fr: "Original (V1)" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "J'aime les patates",
      /* wwEditor:start */
      bindingValidation: {
        type: "any",
        tooltip:
          "Version de reference (V1). Chaine, nombre ou tableau de colonnes.",
      },
      /* wwEditor:end */
    },
    modified: {
      label: { en: "Modified", fr: "Modifie" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "J'aime bien les carottes",
      /* wwEditor:start */
      bindingValidation: {
        type: "any",
        tooltip:
          "Mode rouge/vert: une version. Mode orange: liste de versions a comparer a V1.",
      },
      /* wwEditor:end */
    },
    mode: {
      label: { en: "Mode", fr: "Mode" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      options: {
        options: [
          {
            value: "redgreen",
            label: { en: "Red/Green (binary)", fr: "Rouge/Vert (binaire)" },
          },
          {
            value: "orange",
            label: {
              en: "Orange (multi-version)",
              fr: "Orange (multi-versions)",
            },
          },
        ],
      },
      defaultValue: "redgreen",
    },
    lang: {
      label: { en: "Locale", fr: "Locale" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "fr",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Locale pour Intl.Segmenter (ex: fr, en).",
      },
      /* wwEditor:end */
    },
    classPrefix: {
      label: { en: "CSS prefix", fr: "Prefixe CSS" },
      type: "Text",
      section: "settings",
      defaultValue: "wwdiff",
    },
  },
};

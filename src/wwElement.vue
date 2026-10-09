<template>
  <div :class="`${prefix}-root`" v-html="html"></div>
</template>

<script>
import { computeDiffHtml } from "./core/index.js";

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: false, default: "" },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: false },
    /* wwEditor:end */
  },
  computed: {
    prefix() {
      return this.content.classPrefix || "wwdiff";
    },
    html() {
      return computeDiffHtml({
        original: this.content.original,
        modified: this.content.modified,
        mode: this.content.mode === "orange" ? "orange" : "redgreen",
        lang: this.content.lang || "fr",
        classPrefix: this.prefix,
      });
    },
  },
};
</script>

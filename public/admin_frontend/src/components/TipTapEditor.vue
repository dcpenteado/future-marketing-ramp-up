<template>  
  <editor-content :editor="editor" />
</template>
  
<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    extensions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      editor: null,
    }
  },
  watch: {
    value(value) {
      // JSON
      const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },
  mounted() {
    this.editor = new Editor({
      content: this.value,

      extensions: [
        StarterKit,
        ...this.extensions,
      ],

      onUpdate: () => {
        this.$emit('input', this.editor.getJSON())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
.tiptap {
  padding: 1rem;
  border: 1px solid var(--v-mercury-base);
  border-radius: 0.4rem;

  &:focus {
    outline: none;
  }

}

.mention {
  background-color: var(--v-primary-base);
  color: white;
  border-radius: 0.4rem;
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  box-decoration-break: clone;
}
</style>
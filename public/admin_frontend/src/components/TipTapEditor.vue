<template>  
  <v-input :messages="messages" >
    <editor-content :editor="editor" class="w-full" />
  </v-input>
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
    messages: {
      type: Array,
      default: () => ([]),
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
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.38);
  border-radius: 0.4rem;
  min-height: 10rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--v-primary-base);
    border-width: 2px;
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
<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import type { JSONContent } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

const props = withDefaults(defineProps<{
  modelValue?: JSONContent
}>(), {
  modelValue: () => ({
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
})

const emit = defineEmits<{
  'update:modelValue': [content: JSONContent]
}>()

const editor = shallowRef<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    editorProps: {
      attributes: {
        class: [
          'min-h-48',
          'w-full',
          'rounded-md',
          'px-3',
          'py-2',
          'ring',
          'ring-inset',
          'ring-accented',
          'outline-primary/25',
          'focus-visible:outline-3',
          'focus-visible:ring-primary',
          'text-sm',
          'leading-6',
          '[&_p]:my-3',
          '[&_h1]:mt-8',
          '[&_h1]:mb-4',
          '[&_h1]:text-3xl',
          '[&_h1]:font-bold',
          '[&_h2]:mt-6',
          '[&_h2]:mb-3',
          '[&_h2]:text-2xl',
          '[&_h2]:font-semibold',
          '[&_h3]:mt-5',
          '[&_h3]:text-xl',
          '[&_h3]:font-semibold',
          '[&_h4]:mt-4',
          '[&_h4]:text-lg',
          '[&_h4]:font-semibold',
          '[&_h5]:mt-4',
          '[&_h5]:text-base',
          '[&_h5]:font-semibold',
          '[&_h6]:mt-4',
          '[&_h6]:text-sm',
          '[&_h6]:font-semibold',
          '[&_ul]:my-4',
          '[&_ul]:list-disc',
          '[&_ul]:pl-6',
          '[&_ol]:my-4',
          '[&_ol]:list-decimal',
          '[&_ol]:pl-6',
          '[&_ul[data-type=taskList]]:list-none',
          '[&_ul[data-type=taskList]]:pl-0',
          '[&_ul[data-type=taskList]>li]:flex',
          '[&_ul[data-type=taskList]>li]:items-start',
          '[&_ul[data-type=taskList]>li]:gap-2',
          '[&_ul[data-type=taskList]>li>div]:min-w-0',
          '[&_ul[data-type=taskList]>li>div]:flex-1',
          '[&_ul[data-type=taskList]>li>div>p]:my-0',
          '[&_blockquote]:border-l-4',
          '[&_blockquote]:border-default',
          '[&_blockquote]:pl-4',
          '[&_blockquote]:italic',
          '[&_code]:rounded',
          '[&_code]:bg-muted',
          '[&_code]:text-highlighted',
          '[&_code]:px-1',
          '[&_code]:py-0.5',
          '[&_pre]:my-4',
          '[&_pre]:overflow-x-auto',
          '[&_pre]:rounded-md',
          '[&_pre]:border',
          '[&_pre]:border-muted',
          '[&_pre]:bg-muted',
          '[&_pre]:p-4',
          '[&_pre]:text-highlighted',
          '[&_pre_code]:bg-transparent',
          '[&_pre_code]:p-0',
          '[&_mark]:rounded',
          '[&_mark]:bg-warning/30',
          '[&_mark]:px-1'
        ].join(' ')
      }
    },
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getJSON())
    }
  })
})

watch(() => props.modelValue, (content) => {
  if (!editor.value || !content) return
  if (JSON.stringify(editor.value.getJSON()) === JSON.stringify(content)) return

  editor.value.commands.setContent(content, { emitUpdate: false })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <EditorContent
    v-if="editor"
    :editor="editor"
    class="w-full rounded-md bg-default shadow-xs ring ring-inset ring-accented transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary"
  />
</template>

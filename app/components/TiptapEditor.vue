<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import type { JSONContent } from '@tiptap/core'
import { TaskItem, TaskList } from '@tiptap/extension-list'

const value = defineModel<JSONContent>({
  default: () => ({
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
})

const extensions = [
  TaskList,
  TaskItem.configure({
    nested: true
  })
]

const editorUi = {
  base: [
    '[&_ul[data-type=taskList]]:list-none',
    '[&_ul[data-type=taskList]]:ps-0',
    '[&_ul[data-type=taskList]>li]:flex',
    '[&_ul[data-type=taskList]>li]:items-start',
    '[&_ul[data-type=taskList]>li]:gap-2',
    '[&_ul[data-type=taskList]>li]:ps-0',
    '[&_ul[data-type=taskList]>li>label]:mt-1',
    '[&_ul[data-type=taskList]>li>label]:shrink-0',
    '[&_ul[data-type=taskList]>li>div]:min-w-0',
    '[&_ul[data-type=taskList]>li>div]:flex-1',
    '[&_ul[data-type=taskList]>li>div>p]:my-0'
  ].join(' ')
}

const items: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline' },
  { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
  { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'taskList', icon: 'i-lucide-list-checks' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { kind: 'link', icon: 'i-lucide-link' },
  { kind: 'emoji', icon: 'i-lucide-smile' }
]
</script>

<template>
  <UEditor
    v-slot=" { editor }"
    v-model=" value "
    placeholder="Start writing..."
    content-type="json"
    :extensions="extensions"
    :ui="editorUi"
    class="w-full min-h-60 rounded-md px-3 py-2 ring ring-inset ring-accented outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
  >
    <UEditorToolbar
      :editor="editor"
      :items="items"
      class="w-full pb-2 mb-8 border-b border-accented"
    />
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>

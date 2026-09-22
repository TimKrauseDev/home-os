import type { JSONContent } from '@tiptap/core'

export interface TodoItem {
  id: string
  due_date: string | null
  title: string
  description: string
  content: JSONContent
  category: string
  completed: boolean
}

export type NewTodo = Omit<TodoItem, 'id'>

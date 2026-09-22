export interface TodoItem {
  id: string
  due_date: string | null
  title: string
  category: string
  completed: boolean
}

export type NewTodo = Omit<TodoItem, 'id'>

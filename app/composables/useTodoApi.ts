import type { TodoItem, NewTodo } from '~/types/todo'

export function useTodoApi() {
  const toast = useToast()

  // Fetch a single todo item by its ID
  const fetchTodo = async (id: string) =>
    await useFetch<TodoItem>(() => `/api/todos/${id}`)

  const fetchTodos = async () =>
    await useFetch<TodoItem[]>('/api/todos', { default: () => [] })

  // Add a new todo item
  const addTodo = async (data: NewTodo) => {
    console.log('Adding new todo:', data)
    try {
      await $fetch('/api/todos', {
        method: 'POST',
        body: {
          ...data,
          due_date: data.due_date || null
        }
      })
      toast.add({
        title: 'Task added successfully.',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } catch (error) {
      console.error(error)
      toast.add({
        title: 'Failed to add task.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  }

  // Update an existing todo item
  const updateTodo = async (id: string, data: NewTodo) => {
    try {
      await $fetch(`/api/todos/${id}`, {
        method: 'PUT',
        body: {
          ...data,
          due_date: data.due_date || null
        }
      })
      toast.add({
        title: 'Task updated successfully.',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } catch (error) {
      console.error(error)
      toast.add({
        title: 'Failed to update task.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  }

  // Update todo completion status
  const updateTodoCompletion = async (todo: TodoItem) => {
    try {
      await $fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: { completed: !todo.completed }
      })
    } catch (error) {
      console.error(error)
      toast.add({
        title: 'Failed to update task.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
      return false
    }
    toast.add({
      title: 'Task updated successfully.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    return true
  }

  // Delete a todo item by its ID
  const deleteTodo = async (id: string) => {
    try {
      await $fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })
      toast.add({
        title: 'Task deleted successfully.',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
      navigateTo('/todo')
    } catch (error) {
      console.error(error)
      toast.add({
        title: 'Failed to delete task.',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
      return
    }
  }

  return {
    fetchTodo,
    fetchTodos,
    addTodo,
    updateTodo,
    updateTodoCompletion,
    deleteTodo
  }
}

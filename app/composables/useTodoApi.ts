import type { TodoItem } from '~/types/todo'

const toast = useToast()

export function useTodoApi() {
  // Fetch a single todo item by its ID
  const fetchTodo = async (id: string) =>
    await useFetch<TodoItem>(() => `/api/todos/${id}`)

  // Add a new todo item
  const addTodo = () => {}

  // Update an existing todo item
  const updateTodo = async (data: TodoItem) => {
    try {
      await $fetch(`/api/todos/${data.id}`, {
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
    addTodo,
    updateTodo,
    deleteTodo
  }
}

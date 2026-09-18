<script setup lang="ts">
import type { TodoItem } from '~/types/todo'

const toast = useToast()

const { data, refresh } = await useFetch<TodoItem[]>('/api/todos', { default: () => [] })

async function toggleTodo(todo: TodoItem) {
  const completed = !todo.completed

  data.value = data.value.map(item =>
    item.id === todo.id ? { ...item, completed } : item
  )

  try {
    await $fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      body: { completed }
    })
  } catch (error) {
    data.value = data.value.map(item =>
      item.id === todo.id ? { ...item, completed: todo.completed } : item
    )
    console.error(error)
    toast.add({
      title: 'Failed to update task.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
  await refresh()
  toast.add({
    title: 'Task updated successfully.',
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

async function deleteTodo(todo: TodoItem) {
  try {
    await $fetch(`/api/todos/${todo.id}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Failed to delete task.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    return
  }
  await refresh()
  toast.add({
    title: 'Task deleted successfully.',
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <UDashboardPanel id="todo">
    <!-- Panel Header -->
    <template #header>
      <UDashboardNavbar title="Todo">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Panel Body -->
    <template #body>
      <UCard>
        <TodoTable
          :data=" data "
          @toggle="toggleTodo"
          @delete="deleteTodo"
        />
      </UCard>
    </template>
  </UDashboardPanel>
</template>

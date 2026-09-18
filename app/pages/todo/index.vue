<script setup lang="ts">
import type { TodoItem } from '~/types/todo'

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
  }
  await refresh()
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
      <h1>Todo Page</h1>
      <UCard>
        <TodoTable
          :data=" data "
          @toggle="toggleTodo"
        />
      </UCard>
      <UCard>
        <TodoTableExample />
      </UCard>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TodoItem } from '~/types/todo'

const data = ref<TodoItem[]>([
  {
    id: 1,
    date: new Date(Date.UTC(2024, 2, 8, 20, 15)).toISOString(),
    title: 'Sample Todo',
    category: 'General',
    completed: false
  },
  {
    id: 2,
    date: new Date().toISOString(),
    title: 'Another Sample Todo',
    category: 'Space',
    completed: true
  }
])
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
        <TodoTable :data=" data " />
      </UCard>
      <UCard>
        <TodoTableExample />
      </UCard>
      <UCard>
        <ul>
          <li v-for="(item, index) in data" :key=" index ">
            <input
              v-model=" item.status "
              type="checkbox"
              :true-value=" 'completed' "
              :false-value=" 'pending' "
            >
            <span :class=" { 'line-through': item.status === 'completed' } ">{{ item.title }}</span>
          </li>
        </ul>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

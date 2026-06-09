<script setup lang="ts">
const fields = [
  { key: 'project_id', label: 'Project', type: 'select', required: true, optionSource: { tableName: 'home_improvement_projects', labelColumn: 'title' } },
  { key: 'title', label: 'Todo', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Completed', value: 'completed' }, { label: 'Skipped', value: 'skipped' }, { label: 'Canceled', value: 'canceled' }] },
  { key: 'due_date', label: 'Due', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Project Todos"
    description="Work steps with notes for materials, purchases, measurements, tools, or links."
    icon="i-lucide-list-todo"
    add-label="Add Todo"
    empty-label="No project todos yet."
    :fields="fields"
    table-name="home_improvement_todos"
    :order-by="{ column: 'due_date', ascending: true }"
    :stats="[
      { label: 'Pending', value: '2', icon: 'i-lucide-clock' },
      { label: 'In Progress', value: '1', icon: 'i-lucide-loader-circle' },
      { label: 'Due Soon', value: '3', icon: 'i-lucide-calendar-clock' },
      { label: 'Completed', value: '0', icon: 'i-lucide-check' }
    ]"
  />
</template>

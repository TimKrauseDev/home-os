<script setup lang="ts">
const fields = [
  { key: 'task_id', label: 'Task', type: 'select', required: true, optionSource: { tableName: 'home_maintenance_tasks', labelColumn: 'title' } },
  { key: 'completed_at', label: 'Completed', type: 'date' },
  { key: 'completed_by', label: 'Completed By' },
  { key: 'notes', label: 'Notes', type: 'textarea' }
] as const
</script>

<template>
  <DomainTablePage
    title="Maintenance History"
    description="Completed maintenance records, simple notes, and follow-up context."
    icon="i-lucide-history"
    add-label="Add Completion"
    empty-label="No maintenance completions yet."
    :actions="[{ label: 'Tasks', icon: 'i-lucide-list-checks', to: '/home-maintenance/tasks' }]"
    :fields="fields"
    table-name="home_maintenance_completions"
    :order-by="{ column: 'completed_at', ascending: false }"
    :stats="[
      { label: 'This Month', value: '2', icon: 'i-lucide-calendar-check' },
      { label: 'This Year', value: '18', icon: 'i-lucide-check' },
      { label: 'With Notes', value: '3', icon: 'i-lucide-message-square' },
      { label: 'Tracked Tasks', value: '4', icon: 'i-lucide-link' }
    ]"
  />
</template>

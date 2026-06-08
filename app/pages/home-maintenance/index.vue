<script setup lang="ts">
const fields = [
  { key: 'title', label: 'Item', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Paused', value: 'paused' }, { label: 'Archived', value: 'archived' }] },
  { key: 'area', label: 'Area', type: 'select', options: [{ label: 'Interior', value: 'interior' }, { label: 'Exterior', value: 'exterior' }] },
  { key: 'next_due_date', label: 'Due', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' }
] as const
</script>

<template>
  <DomainTablePage
    title="Home Maintenance"
    description="Recurring household care by monthly, seasonal, yearly, and custom cadence."
    icon="i-lucide-wrench"
    add-label="Add Attention Item"
    empty-label="No maintenance items need attention."
    :actions="[{ label: 'Tasks', icon: 'i-lucide-list-checks', to: '/home-maintenance/tasks' }, { label: 'History', icon: 'i-lucide-history', to: '/home-maintenance/history' }]"
    :fields="fields"
    table-name="home_maintenance_tasks"
    :order-by="{ column: 'next_due_date', ascending: true }"
    :stats="[
      { label: 'Due Soon', value: '1', icon: 'i-lucide-calendar-clock' },
      { label: 'Overdue', value: '0', icon: 'i-lucide-triangle-alert' },
      { label: 'In Progress', value: '1', icon: 'i-lucide-loader-circle' },
      { label: 'Upcoming', value: '1', icon: 'i-lucide-calendar' }
    ]"
  />
</template>

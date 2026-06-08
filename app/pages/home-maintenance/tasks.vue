<script setup lang="ts">
const fields = [
  { key: 'title', label: 'Task', required: true },
  { key: 'area', label: 'Area', type: 'select', options: [{ label: 'Interior', value: 'interior' }, { label: 'Exterior', value: 'exterior' }] },
  { key: 'next_due_date', label: 'Next Due', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Paused', value: 'paused' }, { label: 'Archived', value: 'archived' }] },
  { key: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }] },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Maintenance Tasks"
    description="Recurring care tasks with area, cadence, next due date, status, priority, and notes."
    icon="i-lucide-list-checks"
    add-label="Add Task"
    empty-label="No maintenance tasks yet."
    :actions="[{ label: 'History', icon: 'i-lucide-history', to: '/home-maintenance/history' }]"
    :fields="fields"
    table-name="home_maintenance_tasks"
    :order-by="{ column: 'next_due_date', ascending: true }"
    :stats="[
      { label: 'Active', value: '3', icon: 'i-lucide-list-checks' },
      { label: 'Interior', value: '2', icon: 'i-lucide-sofa' },
      { label: 'Exterior', value: '2', icon: 'i-lucide-trees' },
      { label: 'In Progress', value: '1', icon: 'i-lucide-loader-circle' }
    ]"
  />
</template>

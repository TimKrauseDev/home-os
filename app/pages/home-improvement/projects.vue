<script setup lang="ts">
const fields = [
  { key: 'title', label: 'Project', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Idea', value: 'idea' }, { label: 'Planned', value: 'planned' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Blocked', value: 'blocked' }, { label: 'Completed', value: 'completed' }, { label: 'Canceled', value: 'canceled' }, { label: 'Archived', value: 'archived' }] },
  { key: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }] },
  { key: 'area', label: 'Area' },
  { key: 'estimated_total', label: 'Estimated', type: 'number' },
  { key: 'actual_total', label: 'Actual', type: 'number', table: false },
  { key: 'target_end_date', label: 'Target End', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Projects"
    description="Project status, priority, room or area, dates, notes, links, and pricing."
    icon="i-lucide-folder-kanban"
    add-label="Add Project"
    empty-label="No projects yet."
    :fields="fields"
    table-name="home_improvement_projects"
    :order-by="{ column: 'target_end_date', ascending: true }"
    :stats="[
      { label: 'Active', value: '1', icon: 'i-lucide-hammer' },
      { label: 'Blocked', value: '1', icon: 'i-lucide-octagon-alert' },
      { label: 'Estimated', value: '$2,300', icon: 'i-lucide-dollar-sign' },
      { label: 'Planned', value: '1', icon: 'i-lucide-calendar' }
    ]"
  />
</template>

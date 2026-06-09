<script setup lang="ts">
const fields = [
  { key: 'title', label: 'Project', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Idea', value: 'idea' }, { label: 'Planned', value: 'planned' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Blocked', value: 'blocked' }, { label: 'Completed', value: 'completed' }] },
  { key: 'area', label: 'Area' },
  { key: 'estimated_total', label: 'Rough Cost', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Home Improvement"
    description="Lightweight projects for upgrades, repairs, builds, renovations, and larger purchases."
    icon="i-lucide-hammer"
    add-label="Add Project Signal"
    empty-label="No improvement projects yet."
    :fields="fields"
    table-name="home_improvement_projects"
    :order-by="{ column: 'target_end_date', ascending: true }"
    :stats="[
      { label: 'Active', value: '1', icon: 'i-lucide-hammer' },
      { label: 'Blocked', value: '1', icon: 'i-lucide-octagon-alert' },
      { label: 'Next Todos', value: '3', icon: 'i-lucide-list-todo' },
      { label: 'Estimated', value: '$2,300', icon: 'i-lucide-dollar-sign' }
    ]"
  />
</template>

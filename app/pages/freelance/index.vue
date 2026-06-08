<script setup lang="ts">
const fields = [
  { key: 'workflow', label: 'Possible Workflow', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Reserved', value: 'reserved' }, { label: 'Future', value: 'future' }, { label: 'Deferred', value: 'deferred' }] },
  { key: 'priority', label: 'Priority', type: 'select', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }] },
  { key: 'notes', label: 'Notes', type: 'textarea' }
] as const
</script>

<template>
  <DomainTablePage
    title="Freelance"
    description="Future workspace. This domain is intentionally out of v1 unless it becomes needed."
    icon="i-lucide-briefcase"
    add-label="Add Freelance Idea"
    empty-label="No freelance ideas yet."
    :fields="fields"
    table-name="freelance_workflows"
    :order-by="{ column: 'workflow', ascending: true }"
    :stats="[
      { label: 'Status', value: 'Future', icon: 'i-lucide-clock' },
      { label: 'Priority', value: 'After v1', icon: 'i-lucide-arrow-down' },
      { label: 'Scope', value: 'Reserved', icon: 'i-lucide-briefcase' },
      { label: 'Routes', value: 'Ready', icon: 'i-lucide-route' }
    ]"
  />
</template>

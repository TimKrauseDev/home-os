<script setup lang="ts">
const stats = [
  { label: 'Status', value: 'Future', icon: 'i-lucide-clock' },
  { label: 'Priority', value: 'After v1', icon: 'i-lucide-arrow-down' },
  { label: 'Scope', value: 'Reserved', icon: 'i-lucide-briefcase' },
  { label: 'Routes', value: 'Ready', icon: 'i-lucide-route' }
]
const sections = [
  {
    title: 'Possible Future Work',
    description: 'Reserved space for freelance operations if needed.',
    icon: 'i-lucide-briefcase',
    items: ['Clients and contacts', 'Invoices and payments', 'Project deadlines', 'Tax notes and exports']
  },
  {
    title: 'V1 Decision',
    description: 'Keep focus on household operations first.',
    icon: 'i-lucide-circle-pause',
    items: ['Do not build freelance database yet', 'Keep route available in nav', 'Revisit only after gardening, maintenance, improvements, budgeting, and dashboard are useful']
  }
]
</script>

<template>
  <DomainScaffold
    title="Freelance"
    description="Future workspace. This domain is intentionally out of v1 unless it becomes needed."
    icon="i-lucide-briefcase"
    :stats="stats"
    :sections="sections"
  />
</template>

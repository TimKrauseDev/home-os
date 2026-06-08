<script setup lang="ts">
const stats = [
  { label: 'Idea', value: '5', icon: 'i-lucide-lightbulb' },
  { label: 'Planned', value: '3', icon: 'i-lucide-calendar' },
  { label: 'In Progress', value: '2', icon: 'i-lucide-loader-circle' },
  { label: 'Completed', value: '7', icon: 'i-lucide-check' }
]
const sections = [
  {
    title: 'Project Board',
    description: 'A practical project list before detailed CRUD.',
    icon: 'i-lucide-folder-kanban',
    items: ['Office shelves · in progress · office · $450 est', 'Guest bath refresh · blocked · bathroom · $1,200 est', 'Garden bed rebuild · planned · yard · $650 est', 'Garage storage · idea · garage · $900 est']
  },
  {
    title: 'Project Fields',
    description: 'The shape this page should persist later.',
    icon: 'i-lucide-database',
    items: ['Title, description, status, priority', 'Area or room', 'Target dates and completion date', 'Estimated total, actual total, long-form notes']
  }
]
</script>

<template>
  <DomainScaffold
    title="Projects"
    description="Project status, priority, room or area, dates, notes, links, and pricing."
    icon="i-lucide-folder-kanban"
    :actions="[{ label: 'Todos', icon: 'i-lucide-list-todo', to: '/home-improvement/todos' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

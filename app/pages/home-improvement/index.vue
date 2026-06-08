<script setup lang="ts">
const actions = [
  { label: 'Projects', icon: 'i-lucide-folder-kanban', to: '/home-improvement/projects' },
  { label: 'Todos', icon: 'i-lucide-list-todo', to: '/home-improvement/todos' }
]
const stats = [
  { label: 'Active', value: '4 projects', icon: 'i-lucide-hammer' },
  { label: 'Blocked', value: '2 projects', icon: 'i-lucide-octagon-alert' },
  { label: 'Next Todos', value: '9 items', icon: 'i-lucide-list-todo' },
  { label: 'Estimated', value: '$6,450', icon: 'i-lucide-dollar-sign' }
]
const sections = [
  {
    title: 'Active Work',
    description: 'Project workspace for household upgrades and repairs.',
    icon: 'i-lucide-folder-kanban',
    items: ['Office shelves · in progress', 'Garden bed rebuild · planned', 'Guest bath refresh · blocked', 'Garage storage · idea']
  },
  {
    title: 'Project Notes',
    description: 'Notes carry links, references, measurements, and decisions.',
    icon: 'i-lucide-notebook-tabs',
    items: ['No separate items list in V1', 'Todo notes can mention needed purchases', 'Project notes can contain links', 'Estimated and actual totals stay at project level']
  }
]
</script>

<template>
  <DomainScaffold
    title="Home Improvement"
    description="Lightweight projects for upgrades, repairs, builds, renovations, and larger purchases."
    icon="i-lucide-hammer"
    :actions="actions"
    :stats="stats"
    :sections="sections"
  />
</template>

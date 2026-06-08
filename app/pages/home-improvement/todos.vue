<script setup lang="ts">
const stats = [
  { label: 'Pending', value: '12', icon: 'i-lucide-clock' },
  { label: 'In Progress', value: '3', icon: 'i-lucide-loader-circle' },
  { label: 'Due Soon', value: '4', icon: 'i-lucide-calendar-clock' },
  { label: 'Blocked', value: '2', icon: 'i-lucide-octagon-alert' }
]
const sections = [
  {
    title: 'Next Todos',
    description: 'Todo steps with purchase notes when needed.',
    icon: 'i-lucide-list-todo',
    items: ['Measure office wall for shelves · note bracket spacing', 'Buy cedar boards for garden beds', 'Pick guest bath vanity paint', 'Sort garage bins before storage install']
  },
  {
    title: 'Todo Workflow',
    description: 'The lightweight task model for projects.',
    icon: 'i-lucide-route',
    items: ['Pending, in progress, completed, skipped, canceled', 'Optional due date', 'Optional notes for materials or links', 'Manual sort order later']
  }
]
</script>

<template>
  <DomainScaffold
    title="Project Todos"
    description="Work steps with notes for materials, purchases, measurements, tools, or links."
    icon="i-lucide-list-todo"
    :actions="[{ label: 'Projects', icon: 'i-lucide-folder-kanban', to: '/home-improvement/projects' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

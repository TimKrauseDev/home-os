<script setup lang="ts">
const stats = [
  { label: 'Categories', value: '32 active', icon: 'i-lucide-tags' },
  { label: 'Over Goal', value: '3', icon: 'i-lucide-triangle-alert' },
  { label: 'Under Goal', value: '21', icon: 'i-lucide-check' },
  { label: 'Track Only', value: '8', icon: 'i-lucide-eye' }
]
const sections = [
  {
    title: 'Category Goals',
    description: 'Monthly limits and savings targets.',
    icon: 'i-lucide-gauge',
    items: ['Groceries · keep under $700', 'Restaurants · keep under $250', 'House repairs · track only', 'Vacation · save at least $300']
  },
  {
    title: 'Goal Behaviors',
    description: 'Budget goals can mean different things by category.',
    icon: 'i-lucide-sliders-horizontal',
    items: ['Keep under for expense limits', 'Spend exactly for planned bills', 'Save at least for buckets', 'Track only when a goal is not useful']
  }
]
</script>

<template>
  <DomainScaffold
    title="Categories"
    description="Budget categories, monthly goals, groupings, and merchant defaults."
    icon="i-lucide-tags"
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

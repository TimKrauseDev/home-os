<script setup lang="ts">
const actions = [
  { label: 'Accounts', icon: 'i-lucide-landmark', to: '/budgeting/accounts' },
  { label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' },
  { label: 'Settle Up', icon: 'i-lucide-hand-coins', to: '/budgeting/settlements' }
]
const stats = [
  { label: 'Net Worth', value: '$42,380', icon: 'i-lucide-chart-no-axes-combined' },
  { label: 'Money In', value: '$7,250', icon: 'i-lucide-arrow-down-left' },
  { label: 'Money Out', value: '$5,980', icon: 'i-lucide-arrow-up-right' },
  { label: 'To Settle', value: '$750', icon: 'i-lucide-hand-coins' }
]
const sections = [
  {
    title: 'Budget Review',
    description: 'Household money in, money out, category limits, and cash flow.',
    icon: 'i-lucide-wallet',
    items: ['Review balances by account owner', 'Watch category goals and overages', 'Track savings buckets for fun money and large purchases', 'Keep transaction imports manual for V1']
  },
  {
    title: 'Next Financial Tasks',
    description: 'A quick operating list for the household budget.',
    icon: 'i-lucide-list-todo',
    items: ['Import latest checking CSV', 'Categorize uncategorized transactions', 'Review grocery goal', 'Settle shared mortgage and credit card difference']
  }
]
</script>

<template>
  <DomainScaffold
    title="Budgeting"
    description="Household finances, transactions, category goals, savings buckets, and settlement tasks."
    icon="i-lucide-wallet"
    :actions="actions"
    :stats="stats"
    :sections="sections"
  />
</template>

<script setup lang="ts">
const stats = [
  { label: 'Pending', value: '$750', icon: 'i-lucide-hand-coins' },
  { label: 'Requests', value: '3 open', icon: 'i-lucide-send' },
  { label: 'Completed', value: '8', icon: 'i-lucide-check' },
  { label: 'Linked Rows', value: '14', icon: 'i-lucide-link' }
]
const sections = [
  {
    title: 'Settle Up Queue',
    description: 'Who needs to pay whom, based on linked transactions or manual requests.',
    icon: 'i-lucide-hand-coins',
    items: ['Spouse pays self · $750 · mortgage/shared card difference', 'Self pays spouse · $60 · garden supplies split', 'Spouse pays self · $125 · furniture deposit']
  },
  {
    title: 'Calculation Rules',
    description: 'Keep the math explicit and reviewable.',
    icon: 'i-lucide-calculator',
    items: ['Derive who paid from account owner', 'Link multiple transactions per settlement task', 'Support half, full, percentage, fixed amount, or custom', 'Allow manual settlement tasks']
  }
]
</script>

<template>
  <DomainScaffold
    title="Settle Up"
    description="Household payback tasks from shared transactions, net differences, and large purchases."
    icon="i-lucide-hand-coins"
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

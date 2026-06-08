<script setup lang="ts">
const stats = [
  { label: 'Accounts', value: '8 active', icon: 'i-lucide-landmark' },
  { label: 'Self', value: '$18,420', icon: 'i-lucide-user' },
  { label: 'Spouse', value: '$16,880', icon: 'i-lucide-user-round' },
  { label: 'Joint', value: '$8,080', icon: 'i-lucide-users' }
]
const sections = [
  {
    title: 'Account List',
    description: 'Balances by institution and household owner.',
    icon: 'i-lucide-landmark',
    items: ['Checking · self · $4,250', 'Shared credit card · spouse · -$500', 'Savings · joint · $8,080', 'Retirement · self · tracked only']
  },
  {
    title: 'Account Fields',
    description: 'The account model for imports and settlement math.',
    icon: 'i-lucide-database',
    items: ['Name, owner, account type, institution', 'Current and available balances', 'Active flag', 'Notes for manual context']
  }
]
</script>

<template>
  <DomainScaffold
    title="Accounts"
    description="Household financial accounts, ownership, balances, and institutions."
    icon="i-lucide-landmark"
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

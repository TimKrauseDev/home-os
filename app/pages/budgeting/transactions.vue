<script setup lang="ts">
const stats = [
  { label: 'This Month', value: '128 rows', icon: 'i-lucide-receipt-text' },
  { label: 'Unreviewed', value: '18', icon: 'i-lucide-circle-help' },
  { label: 'Uncategorized', value: '9', icon: 'i-lucide-tags' },
  { label: 'Imports', value: '3 files', icon: 'i-lucide-upload' }
]
const sections = [
  {
    title: 'Transaction Review',
    description: 'Imported rows with merchant and category controls.',
    icon: 'i-lucide-list-filter',
    items: ['Mortgage · housing · -$2,000', 'Shared card payment · transfer · -$500', 'Grocery store · groceries · -$142.18', 'Paycheck · income · $3,625']
  },
  {
    title: 'Merchant Defaults',
    description: 'Defaults help categorize imports without locking each transaction.',
    icon: 'i-lucide-store',
    items: ['Set default category per merchant', 'Change individual transaction category independently', 'Offer update previous transactions for same merchant', 'Keep raw CSV row data for troubleshooting']
  }
]
</script>

<template>
  <DomainScaffold
    title="Transactions"
    description="Imported and manually entered transactions for review, categorization, and merchant defaults."
    icon="i-lucide-receipt-text"
    :actions="[{ label: 'CSV Imports', icon: 'i-lucide-upload', to: '/budgeting/imports' }, { label: 'Categories', icon: 'i-lucide-tags', to: '/budgeting/categories' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

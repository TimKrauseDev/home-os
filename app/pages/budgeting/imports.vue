<script setup lang="ts">
const stats = [
  { label: 'Files', value: '3 this month', icon: 'i-lucide-file-spreadsheet' },
  { label: 'Created', value: '128 rows', icon: 'i-lucide-plus' },
  { label: 'Skipped', value: '4 rows', icon: 'i-lucide-forward' },
  { label: 'Needs Review', value: '18 rows', icon: 'i-lucide-circle-help' }
]
const sections = [
  {
    title: 'CSV Import Flow',
    description: 'Manual import path before bank integrations.',
    icon: 'i-lucide-upload',
    items: ['Choose account and institution', 'Upload CSV file', 'Map columns to transaction fields', 'Apply merchant defaults and preserve raw row data']
  },
  {
    title: 'Recent Imports',
    description: 'Import batches and health checks.',
    icon: 'i-lucide-file-clock',
    items: ['Checking CSV · 72 created · 2 skipped', 'Shared card CSV · 41 created · 1 skipped', 'Savings CSV · 15 created · 1 skipped']
  }
]
</script>

<template>
  <DomainScaffold
    title="CSV Imports"
    description="Upload institution CSV files, review imported rows, and apply merchant defaults."
    icon="i-lucide-upload"
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :stats="stats"
    :sections="sections"
  />
</template>

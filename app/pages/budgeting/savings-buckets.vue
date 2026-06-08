<script setup lang="ts">
const stats = [
  { label: 'Buckets', value: '6 active', icon: 'i-lucide-piggy-bank' },
  { label: 'Allocated', value: '$4,800', icon: 'i-lucide-coins' },
  { label: 'Targets', value: '$9,500', icon: 'i-lucide-target' },
  { label: 'Completed', value: '2', icon: 'i-lucide-check' }
]
const sections = [
  {
    title: 'Savings Plan',
    description: 'Buckets for fun money and larger purchases.',
    icon: 'i-lucide-piggy-bank',
    items: ['Fun money · self · $300', 'Fun money · spouse · $300', 'Vacation · joint · $2,200 of $4,000', 'Furniture · joint · $1,400 of $2,500']
  },
  {
    title: 'Activity',
    description: 'Allocations, withdrawals, purchases, and adjustments.',
    icon: 'i-lucide-list-plus',
    items: ['Allocate $300 to vacation', 'Withdraw $120 from fun money', 'Mark furniture purchase complete', 'Adjust emergency fund balance']
  }
]
</script>

<template>
  <DomainScaffold
    title="Savings Buckets"
    description="Track fun money, larger purchases, and planned household allocations."
    icon="i-lucide-piggy-bank"
    :stats="stats"
    :sections="sections"
  />
</template>

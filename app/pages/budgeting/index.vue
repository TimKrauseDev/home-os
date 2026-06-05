<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Budgeting"
      description="Household finances, transactions, category goals, savings buckets, and settlement tasks."
      icon="i-lucide-wallet"
      variant="subtle"
    />

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UPageCard title="Balances" description="Account totals and cash position will appear here." icon="i-lucide-landmark" />
      <UPageCard title="Budget Health" description="Category progress and money in/out will appear here." icon="i-lucide-chart-no-axes-combined" />
      <UPageCard title="Settle Up" description="Household payback tasks will appear here." icon="i-lucide-hand-coins" />
    </div>
  </div>
</template>

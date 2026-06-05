<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Home Maintenance"
      description="Recurring household care by monthly, seasonal, yearly, and custom cadence."
      icon="i-lucide-wrench"
      variant="subtle"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <UPageCard title="Due Soon" description="Upcoming and overdue maintenance tasks will appear here." icon="i-lucide-calendar-clock" />
      <UPageCard title="Completion History" description="Past maintenance completions will preserve what was done and when." icon="i-lucide-history" />
    </div>
  </div>
</template>

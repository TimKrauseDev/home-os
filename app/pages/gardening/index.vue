<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Gardening"
      description="Seed catalog, sowing windows, and planting reminders for the household garden."
      icon="i-lucide-sprout"
      variant="subtle"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <UPageCard
        title="Plant Soon"
        description="Upcoming sowing windows will appear here after the Gardening schema is built."
        icon="i-lucide-calendar-clock"
      />
      <UPageCard
        title="Seed Catalog"
        description="The main seed table will track variety, source, rating, timing, and growing details."
        icon="i-lucide-table-properties"
      />
    </div>
  </div>
</template>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Home Improvement"
      description="Lightweight projects for upgrades, repairs, builds, renovations, and larger purchases."
      icon="i-lucide-hammer"
      variant="subtle"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <UPageCard title="Active Projects" description="Planned, active, and blocked projects will appear here." icon="i-lucide-folder-kanban" />
      <UPageCard title="Next Todos" description="Project work steps and purchase notes will appear here." icon="i-lucide-list-todo" />
    </div>
  </div>
</template>

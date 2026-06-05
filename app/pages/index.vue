<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <UPageCard
          title="Household Dashboard"
          description="A future overview of what needs attention across gardening, maintenance, improvements, and budgeting."
          icon="i-lucide-house"
          variant="subtle"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <UPageCard
            title="Build Domains First"
            description="The dashboard will be composed after the core workflows exist, so it reflects real household signals instead of placeholder widgets."
            icon="i-lucide-list-checks"
          />
          <UPageCard
            title="Mobile Friendly"
            description="Pages should work comfortably from phones and desktop browsers on the household network."
            icon="i-lucide-smartphone"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

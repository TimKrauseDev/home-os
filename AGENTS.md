# AGENTS.md

This file is the durable project memory for coding agents working in this repository.
Read it at the start of each session before making changes.

For product and architecture context, also read `docs/PROJECT.md`.

## Project

Home OS is the working project in this repository.

Keep product intent, architecture notes, setup commands, and active decisions here as they become known. Do not rely on chat memory for important project context.

## Working Agreements

- Inspect the existing codebase before editing.
- Prefer local patterns, dependencies, and naming conventions already present in the repo.
- Keep changes focused on the user's request.
- Do not revert or overwrite user changes unless explicitly asked.
- Use `rg` or `rg --files` for searching when available.
- Use `apply_patch` for manual file edits.
- Run relevant tests or checks when practical, and report any that could not be run.

## Skills

Always use the following skills. The name and description of the skill can be found each of the files.

- `.agents/skill/nuxt/SKILL.md`
- `.agents/skill/nuxt-ui/SKILL.md`
- `.agents/skill/supabase/SKILL.md`
- `.agents/skill/supabase-postgres-best-practices/SKILL.md`


## Project Notes

- Stack: Nuxt 4 + Nuxt UI + Pinia + Supabase + TypeScript.
- Package manager: pnpm.
- Product posture: locally hosted household operations app for one household; not a public SaaS product.
- Use Nuxt UI as the design/component system.
- UI must be mobile-friendly and responsive from v1; phone use on the household network is a normal workflow.
- Persistence: hosted Supabase is the production database and backup provider.
- Initial app hosting: run from the owner's computer during development; later consider Raspberry Pi or mini PC for always-on household LAN access while keeping hosted Supabase.
- Setup: `pnpm install`.
- Dev server: `pnpm dev`.
- Build: `pnpm build`.
- Preview: `pnpm preview`.
- Lint: `pnpm lint`.
- Typecheck: `pnpm typecheck`.
- Database tools: `pnpm db:migrate:new`, `pnpm db:reset`, `pnpm db:seed`, `pnpm db:seed:garden`, `pnpm db:seed:maintenance`, `pnpm db:seed:improvement`, `pnpm db:seed:budgeting`, `pnpm db:seed:settings`, `pnpm db:seed:dashboard`, `pnpm db:seed:freelance`, `pnpm supabase:types`.
- Main UI layout and navigation live in `app/layouts/default.vue`.

## Product Domains

- Home dashboard: cross-domain overview of what needs attention. Build domain workflows first, then compose dashboard signals from real data.
- Gardening: seed catalog, sowing windows, planting reminders, ratings, notes, purchased-from/source image details. No seed quantity inventory or active plant inventory in v1.
- Home Maintenance: recurring household care tasks with multiple cadences, due dates, completion history, and interior/exterior area.
- Home Improvement: lightweight project workspace with projects, todos, notes/links, status, area/room, dates, and pricing. No separate items or references tables in v1.
- Budgeting: household accounts, CSV transaction imports, merchants with default categories, transaction category overrides, category goals, savings buckets, and settlement/payback tasks.
- Freelance: future domain only.

## Planned Route Groups

- Home dashboard: `app/pages/index.vue`
- Gardening: `app/pages/gardening/**`
- Home Maintenance: `app/pages/home-maintenance/**`
- Home Improvement: `app/pages/home-improvement/**`
- Budgeting: `app/pages/budgeting/**`
- Settings: `app/pages/settings/**`
- Freelance: `app/pages/freelance/**` when needed later

## Implementation Priority

1. Gardening workflows.
2. Home Maintenance and Home Improvement workflows.
3. Budgeting workflows.
4. Home dashboard composition.
5. Freelance only if needed.

## Notifications and Export

- V1 notifications: email reminders for upcoming items.
- Post-v1 notifications: add ntfy push notifications if phone alerts are useful.
- SMS is optional later due to cost/setup.
- V1 export: per-domain CSV exports first, then whole-database export for disaster recovery.

## Current TODOs

- Rebuild app structure around the finalized top-level domains.
- Start implementation with the Gardening schema and workflows.

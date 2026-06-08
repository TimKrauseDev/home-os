# Home OS Project Overview

This document is the product and architecture source of truth for Home OS.

Use AGENTS.md for agent workflow rules.
Use this file for product intent, technical decisions, scope, and implementation priorities.

Last updated: 2026-06-04

## Product Purpose

Home OS is a locally hosted household operations app for running day-to-day home life.

The app is intended only for my household and is not a public product.

The home page is a household dashboard: an overview of what needs attention now, with links into each domain for deeper work. Build the domain workflows first, then compose the dashboard from the signals those workflows produce.

It prioritizes:

- Practical daily workflows over generic SaaS features.
- Private household data ownership and local control.
- Long-term household memory (tasks, finances, projects, notes).

## Target Users

- The owner of this system and members of the same household.
- The app should be comfortable to use from both desktop browsers and phones on the household network.

## Product Scope

### In Scope

- Gardening tracker for a seed catalog, planting timing, notes, ratings, source images, and planting reminders.
- Home maintenance for recurring monthly, seasonal, and yearly maintenance schedules.
- Home improvement projects for todos, notes, links, status, pricing, and related project details.
- Budgeting for household finances, balances, income, expenses, categories, category goals, and savings buckets.
- Household dashboard and settings.
- Internal APIs and Supabase-backed persistence.

### Reserved / Future Scope

- Freelance workflows (kept as a domain but lower priority).

## Confirmed Technical Stack

- Framework: Nuxt 4
- UI: Nuxt UI
- State: Pinia
- Utilities: VueUse, date-fns, Zod
- Database and auth tooling: Supabase
- Language: TypeScript
- Package manager: pnpm
- Linting: ESLint via @nuxt/eslint

## Confirmed Commands

- Install dependencies: pnpm install
- Run development server: pnpm dev
- Build for production: pnpm build
- Preview production build: pnpm preview
- Lint: pnpm lint
- Typecheck: pnpm typecheck
- Generate Supabase migration: pnpm db:migrate:new
- Reset linked database: pnpm db:reset
- Seed gardening data: pnpm db:seed:garden
- Generate Supabase TypeScript types: pnpm supabase:types

## Planned App Structure and Entry Points

- Nuxt source directory: app/
- App shell entry: app/app.vue
- Main layout and navigation: app/layouts/default.vue
- Primary route groups:
	- Home dashboard: app/pages/index.vue
	- Gardening: app/pages/gardening/**
	- Home Maintenance: app/pages/home-maintenance/**
	- Home Improvement: app/pages/home-improvement/**
	- Budgeting: app/pages/budgeting/**
	- Freelance: app/pages/freelance/**
	- Settings: app/pages/settings/**

- Server endpoints: server/api/*.ts
- Shared DB types: database/database.types.ts
- Schema migrations: supabase/migrations/*.sql

## Initial Domain Plan

- Home dashboard: cross-domain overview of what needs attention, including upcoming tasks, important budget signals, household reminders, and quick links into domain pages. Implement after the core domain workflows are built so the dashboard reflects real operational needs.
- Gardening: seed catalog, planting timing, seed comments, overall ratings, seed source tracking, source images, and planting reminders. Do not prioritize seed quantity counts or active plant inventory.
- Home maintenance: recurring household maintenance schedules organized by monthly, seasonal, and yearly cadence.
- Home improvement projects: project todos, notes, links, status, pricing, and related details.
- Budgeting: household finances for the owner and spouse, similar in spirit to Monarch-style budgeting. Track total balances, money in and out, categorized expenditures, category goals, and savings buckets for fun money and larger purchases.
- Freelance: optional future workspace.

## Architecture Decisions

- Local-first product posture.
- Single-household focus (no multi-tenant SaaS requirements).
- Top-level app domains are Home dashboard, Gardening, Home Maintenance, Home Improvement, Budgeting, Settings, and future Freelance.
- Server API routes under /api/** with configured CORS route rules.
- Supabase is the persistence backbone for structured data.
- UI should be mobile-friendly and responsive from v1, with phone use treated as a normal workflow rather than an afterthought.
- Dashboard signals should be derived from built domain workflows after each domain exists, not designed as standalone widgets first.
- V1 backup/export should support per-domain CSV exports first, then whole-database export for disaster recovery. External backup integrations are not required for v1.

## Data Model Direction

Initial domains to model include:

- Gardening: seed catalog entries, planting windows, seed source images, comments, ratings, and garden tasks.
- Home maintenance: maintenance tasks, cadence, seasonal timing, completion history, notes, and reminders.
- Home improvement projects: projects, todos, notes, links, statuses, and pricing.
- Budgeting: household members, accounts, balances, transactions, categories, category goals, savings buckets, and allocations.

Data model principle:

- Prefer explicit domain tables and typed API boundaries over loosely structured blobs.

### Gardening V1

Gardening v1 is a seed catalog and planting reminder system, not a seed quantity inventory or active plant tracker.

Seed catalog fields:

- Seed location number.
- Recommended sow method: inside, outside, or either.
- Sow timing relative to frost dates, such as 8-10 weeks before last frost or 1-2 weeks after last frost.
- Succession planting flag.
- Type, such as tomato.
- Variety, such as Black Krim.
- Days to emerge.
- Days to maturity.
- Seed depth in inches: 0, 0.125, 0.25, 0.5, 0.75, or 1.
- Row spacing in whole inches.
- Deer resistance flag.
- Sun type, such as full sun, partial sun, or shade.
- Purchased from.
- Source page URL from the seed vendor.
- Source image URL cached from the source page social preview image, or entered manually.
- Overall rating from 1-5.
- Notes.

Gardening timing context:

- Primary garden location is Ebony, Virginia.
- Planting timing should support week ranges around last frost and first frost.
- Succession-planted seeds should be able to create reminder tasks for repeat sowing.

Gardening dashboard:

- Keep the Gardening landing page simple.
- Show what to plant soon based on sow timing.
- Show a table of seed catalog information.
- Do not track seed counts as an important field.
- Do not track active plant inventory in v1.

Gardening v1 data model:

- `garden_seeds`: primary seed catalog table.
- `garden_seed_sowing_windows`: sowing timing entries for a seed, allowing multiple methods and frost-relative windows per seed.
- `garden_seed_tasks`: optional reminder tasks generated from seed catalog entries, especially for succession planting.

`garden_seeds` fields:

- `id`: primary key.
- `location_number`: seed storage location number.
- `type`: plant type, such as tomato.
- `variety`: variety name, such as Black Krim.
- `recommended_sow_method`: optional preferred sow method for quick scanning, such as inside or outside.
- `is_succession_planted`: whether this seed should be planted repeatedly.
- `succession_interval_days`: optional interval for repeat sowing reminders.
- `days_to_emerge`: optional number.
- `days_to_maturity`: optional number.
- `seed_depth_inches`: optional enum value of 0, 0.125, 0.25, 0.5, 0.75, or 1.
- `row_spacing_inches`: optional integer.
- `is_deer_resistant`: optional boolean.
- `sun_type`: full_sun, partial_sun, partial_shade, shade, or unknown.
- `purchased_from`: seed vendor or store.
- `source_page_url`: seed vendor product page URL.
- `source_image_url`: cached image URL from the source page social preview image, or a manually entered image URL.
- `overall_rating`: optional numeric rating from 1-5.
- `notes`: long-form notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`garden_seed_sowing_windows` fields:

- `id`: primary key.
- `seed_id`: reference to `garden_seeds`.
- `sow_method`: inside, outside, or either.
- `sow_reference`: last_frost or first_frost.
- `sow_direction`: before or after.
- `sow_start_weeks`: start of timing range in weeks.
- `sow_end_weeks`: end of timing range in weeks.
- `notes`: optional timing notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`garden_seed_tasks` fields:

- `id`: primary key.
- `seed_id`: reference to `garden_seeds`.
- `title`: task title.
- `due_date`: planned reminder date.
- `status`: pending, completed, skipped, or canceled.
- `completed_at`: optional completion timestamp.
- `notes`: optional task notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

Gardening timing calculation:

- Store frost-relative timing as structured sowing window records rather than a single text field.
- A seed can have multiple sowing windows, such as inside 10-12 weeks before last frost and outside 1-2 weeks after last frost.
- Treat a sowing window as recommended when its `sow_method` matches the seed's `recommended_sow_method`.
- Keep the original sheet wording available through notes if useful during import.
- Use Ebony, Virginia frost dates as configurable app settings before calculating planting windows.

Gardening source images:

- Store the seed vendor page URL separately from the cached image URL.
- Fetch social preview metadata only when creating, editing, or manually refreshing a seed image.
- Prefer `og:image` first, then `twitter:image`, then other page image metadata.
- Do not scrape seed vendor pages while browsing the catalog.
- Allow manual image URL entry when metadata is missing, blocked, or broken.

### Home Maintenance V1

Home Maintenance v1 is a recurring household care system. It tracks scheduled maintenance tasks, when they are due, how often they repeat, and completion history. It is separate from Home Improvement Projects, which are project-based and may include todos, notes, links, and pricing.

Home Maintenance workflow:

- Create maintenance tasks for recurring household care.
- Organize tasks by cadence, such as monthly, seasonal, yearly, or custom.
- Track the next due date for each task.
- Mark tasks complete and store completion history.
- Add notes for what was done, what was observed, and what may need follow-up.
- Surface due and overdue maintenance tasks later on the Home dashboard.

Home Maintenance v1 data model:

- `home_maintenance_tasks`: recurring maintenance definitions.
- `home_maintenance_task_cadences`: cadence entries for a maintenance task, allowing multiple schedules per task.
- `home_maintenance_completions`: completion history for each maintenance task.

`home_maintenance_tasks` fields:

- `id`: primary key.
- `title`: task name.
- `description`: optional task description.
- `area`: optional household area, either interior or exterior.
- `next_due_date`: next planned due date calculated from cadence entries.
- `last_completed_at`: optional timestamp for the latest completion.
- `status`: active, in_progress, paused, or archived.
- `priority`: low, medium, or high.
- `notes`: long-form notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`home_maintenance_task_cadences` fields:

- `id`: primary key.
- `task_id`: reference to `home_maintenance_tasks`.
- `cadence_type`: monthly, seasonal, yearly, or custom.
- `cadence_interval`: optional numeric interval for custom cadences.
- `cadence_unit`: optional unit for custom cadences, such as days, weeks, months, or years.
- `season`: optional season for seasonal tasks, such as spring, summer, fall, or winter.
- `preferred_month`: optional month for yearly tasks.
- `preferred_day`: optional day of month for yearly or monthly tasks.
- `notes`: optional cadence notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`home_maintenance_completions` fields:

- `id`: primary key.
- `task_id`: reference to `home_maintenance_tasks`.
- `completed_at`: completion timestamp.
- `completed_by`: optional household member name or id.
- `notes`: optional completion notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

Home Maintenance dashboard:

- Keep the Home Maintenance landing page focused on due, overdue, and upcoming maintenance tasks.
- Show tasks grouped by due status and cadence.
- Provide a full table/list of active maintenance tasks.
- Preserve completion history for long-term household memory.

Home Maintenance cadence calculation:

- Store cadences as structured child records rather than a single cadence field.
- A task can have multiple cadence entries, such as cleaning windows in both spring and fall.
- Calculate `next_due_date` from all active cadence entries for a task.

### Home Improvement Projects V1

Home Improvement Projects v1 is a project workspace for household upgrades, repairs, builds, renovations, and larger purchases. It tracks what needs to be done, relevant notes, links, project status, and expected or actual pricing.

Home Improvement workflow:

- Create projects for household improvement work.
- Track project status from idea through completion.
- Add todos for work steps.
- Add notes to todos when purchases, materials, or tools are needed.
- Track estimated and actual pricing.
- Store notes, links, and decisions in project notes.
- Surface active or blocked projects later on the Home dashboard.

Home Improvement v1 data model:

- `home_improvement_projects`: primary project table.
- `home_improvement_todos`: project task/todo list.

`home_improvement_projects` fields:

- `id`: primary key.
- `title`: project name.
- `description`: optional project description.
- `status`: idea, planned, in_progress, blocked, completed, canceled, or archived.
- `priority`: low, medium, or high.
- `area`: optional project area or room, such as kitchen, bathroom, bedroom, office, exterior, yard, garage, basement, attic, deck, or whole_home.
- `target_start_date`: optional planned start date.
- `target_end_date`: optional planned end date.
- `completed_at`: optional completion timestamp.
- `estimated_total`: optional estimated total cost.
- `actual_total`: optional actual total cost.
- `notes`: long-form project notes, including links, references, measurements, and decisions.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`home_improvement_todos` fields:

- `id`: primary key.
- `project_id`: reference to `home_improvement_projects`.
- `title`: todo title.
- `notes`: optional todo notes, including purchases, materials, tools, or details needed for the task.
- `status`: pending, in_progress, completed, skipped, or canceled.
- `due_date`: optional due date.
- `completed_at`: optional completion timestamp.
- `sort_order`: optional manual ordering.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

Home Improvement dashboard:

- Keep the Home Improvement landing page focused on active, planned, and blocked projects.
- Show project status, priority, rough cost, and next todos.
- Provide a project detail view for todos, notes, links, and pricing.
- Do not mix one-off improvement projects into recurring Home Maintenance tasks.

### Budgeting V1

Budgeting v1 is a household finance workspace for the owner and spouse. It is similar in spirit to Monarch-style budgeting: track account balances, money in and out, categorized spending, category goals, and savings buckets for fun money or larger purchases.

Budgeting workflow:

- Track household accounts and current balances.
- Track transactions across accounts.
- Upload CSV files from financial institutions and import transactions automatically.
- Categorize income and expenses.
- Set default categories for merchants while still allowing each transaction category to be changed independently.
- Optionally update previous transactions for a merchant when setting or changing that merchant's default category.
- Track household settlement tasks for who needs to pay whom.
- Create reimbursement requests for shared bills, account differences, and large purchases.
- Set monthly category goals or limits.
- Review money in, money out, and net cash flow.
- Track savings buckets for fun money, larger purchases, and other planned allocations.
- Surface important budget signals later on the Home dashboard.

Budgeting v1 data model:

- `budget_accounts`: household financial accounts.
- `budget_categories`: transaction categories and budget goals.
- `budget_merchants`: known merchants/payees and their default category.
- `budget_transactions`: income, expenses, transfers, and adjustments.
- `budget_transaction_imports`: uploaded CSV import batches.
- `budget_settlement_tasks`: reimbursement or settlement tasks between household members.
- `budget_settlement_task_transactions`: transactions included in a settlement task calculation.
- `budget_savings_buckets`: planned savings buckets.
- `budget_savings_bucket_activity`: additions, removals, and balance adjustments for savings buckets.

`budget_accounts` fields:

- `id`: primary key.
- `name`: account name.
- `owner`: optional owner label, such as self, spouse, joint, or household.
- `account_type`: checking, savings, credit_card, investment, retirement, cash, or other.
- `institution`: optional bank or institution name.
- `current_balance`: current account balance.
- `available_balance`: optional available balance.
- `is_active`: whether the account is active.
- `notes`: optional account notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_categories` fields:

- `id`: primary key.
- `name`: category name.
- `group_name`: optional category group, such as housing, food, transportation, personal, debt, savings, or income.
- `category_type`: income, expense, transfer, or savings.
- `monthly_goal_amount`: optional monthly target or limit.
- `goal_behavior`: keep_under, spend_exactly, save_at_least, or track_only.
- `is_active`: whether the category is active.
- `sort_order`: optional manual ordering.
- `notes`: optional category notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_merchants` fields:

- `id`: primary key.
- `name`: merchant or payee name.
- `default_category_id`: optional reference to `budget_categories`.
- `notes`: optional merchant notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_transactions` fields:

- `id`: primary key.
- `account_id`: reference to `budget_accounts`.
- `category_id`: optional reference to `budget_categories`.
- `merchant_id`: optional reference to `budget_merchants`.
- `import_id`: optional reference to `budget_transaction_imports`.
- `transaction_date`: transaction date.
- `description`: transaction description.
- `merchant`: optional merchant or payee.
- `amount`: signed transaction amount.
- `transaction_type`: income, expense, transfer, or adjustment.
- `status`: pending, cleared, reviewed, or ignored.
- `external_id`: optional transaction id from the institution or import file.
- `raw_import_data`: optional original CSV row data for troubleshooting.
- `notes`: optional transaction notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_transaction_imports` fields:

- `id`: primary key.
- `account_id`: reference to `budget_accounts`.
- `file_name`: uploaded CSV file name.
- `institution`: optional institution name.
- `imported_at`: import timestamp.
- `row_count`: number of rows processed.
- `created_count`: number of transactions created.
- `skipped_count`: number of rows skipped.
- `notes`: optional import notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_settlement_tasks` fields:

- `id`: primary key.
- `title`: settlement task title.
- `payer`: household member who should pay.
- `recipient`: household member who should receive payment.
- `source_type`: bill_split, balance_difference, purchase_share, manual, or other.
- `basis_amount`: original amount used for the calculation.
- `share_type`: half, full, percentage, fixed_amount, or custom.
- `share_percentage`: optional percentage for percentage-based requests.
- `amount_due`: calculated or manually entered amount owed.
- `due_date`: optional due date.
- `status`: pending, completed, canceled, or skipped.
- `completed_at`: optional completion timestamp.
- `notes`: optional settlement notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_settlement_task_transactions` fields:

- `id`: primary key.
- `settlement_task_id`: reference to `budget_settlement_tasks`.
- `transaction_id`: reference to `budget_transactions`.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_savings_buckets` fields:

- `id`: primary key.
- `name`: bucket name, such as fun money, vacation, furniture, repairs, or emergency fund.
- `owner`: optional owner label, such as self, spouse, joint, or household.
- `target_amount`: optional savings target.
- `current_amount`: current saved amount.
- `status`: active, paused, completed, or archived.
- `notes`: optional bucket notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

`budget_savings_bucket_activity` fields:

- `id`: primary key.
- `bucket_id`: reference to `budget_savings_buckets`.
- `transaction_id`: optional related transaction.
- `activity_date`: activity date.
- `activity_type`: allocation, withdrawal, purchase, or adjustment.
- `amount`: activity amount.
- `notes`: optional activity notes.
- `created_at`: created timestamp.
- `updated_at`: updated timestamp.

Budgeting dashboard:

- Keep the Budgeting landing page focused on current balances, money in, money out, and budget health.
- Show category progress against goals.
- Show savings bucket balances and progress toward targets.
- Provide transaction review and category assignment workflows.
- Provide a settlement tasks sub-page for who needs to pay whom.
- Do not require bank integrations in v1; manual entry or import can come first.

Budgeting import and categorization:

- CSV imports should map institution data into `budget_transactions`.
- Imported transactions should apply a merchant default category when one exists.
- Merchant default categories are only defaults; changing a transaction category should not change the merchant default.
- When setting or changing a merchant default category, offer an action to update previous transactions for that merchant.
- Preserve raw import details where useful so import mapping issues can be fixed later.

Budgeting settlement tasks:

- Settlement tasks represent household money owed between members.
- Support calculated differences, such as one person paying a $2,000 mortgage while the other pays a $500 shared credit card, producing a $1,500 difference and a $750 task to settle half.
- Support one-off large purchase requests where the payer can request half, full, a percentage, a fixed amount, or a custom amount.
- Settlement tasks should be checkable as completed.
- Settlement tasks can link to multiple transactions when relevant, but should also support manual creation.
- Support settlement calculations based on groups of transactions. The app should derive who paid from each transaction's account owner, compare totals by household member, and split the net difference.

## Security and Privacy Requirements

- Home OS data is private by default.
- Home OS is not intended for public use.
- Avoid introducing external integrations until data-boundary rules are documented.

## Deployment and Notifications

### Hosting Direction

Home OS should be able to run locally for private household use, but the hosting choice affects availability:

- Running on the owner's computer keeps setup simple, but the app is unavailable when that computer is off.
- Running on an always-on home device, such as a mini PC, NAS, or Raspberry Pi, keeps the app local to the household network without requiring the owner's main computer to stay on.
- Running on a small cloud server keeps the app available when home computers are off, but it is no longer purely local. Access should be restricted with authentication, firewall rules, IP allowlisting, or a private VPN.

V1 hosting preference:

- Start by running the app on the owner's computer during development.
- Prefer an always-on home device, such as a Raspberry Pi or mini PC, later if local network access is the priority.
- Consider a small cloud server only if remote access and uptime matter more than purely local hosting.
- Do not make the app publicly accessible without authentication.

Database hosting options:

- Hosted Supabase can be used while the app runs on the owner's computer or a Raspberry Pi. This keeps the app local but stores data in Supabase's cloud.
- Fully local hosting requires running the database locally too, such as Supabase local/self-hosted services or a local Postgres database.
- Production data should stay in hosted Supabase because it provides managed database hosting and backups.
- V1 should continue using hosted Supabase as the confirmed persistence backbone.
- Raspberry Pi or mini PC hosting should run the app server, while Supabase remains the database.

### Notification Direction

Home OS should support reminders for upcoming items, including gardening planting windows, maintenance tasks, improvement todos, budget settlement tasks, and other due items.

V1 notification preference:

- Start with email notifications because they are usually cheaper and simpler than SMS.
- Add push notifications through a self-hostable service soon after v1 is complete if phone alerts are useful without SMS costs.
- Treat SMS as optional because it usually has per-message costs and setup requirements.

Potential notification options:

- Email API, such as Resend, for low-volume reminder emails.
- Self-hosted or hosted push notifications, such as ntfy, for phone/web push-style alerts after v1.
- SMS provider, such as Twilio, only if true text messages are required.

Notification scheduling:

- Use scheduled jobs to periodically find due or upcoming items and send reminders.
- Supabase scheduled Edge Functions are a possible fit if using hosted Supabase for backend jobs.
- Notification preferences should be configurable by household member, channel, and domain.

## Implementation Priority (Starting Point)

1. Define and build Gardening workflows.
2. Define and build Home Maintenance and Home Improvement workflows.
3. Define and build Budgeting workflows.
4. Compose the Home dashboard from the most important signals across the built domains.
5. Add Freelance workflows only if needed.

## Open Questions

- None currently.

drop table if exists budget_savings_bucket_activity;
drop table if exists budget_savings_buckets;
drop table if exists budget_settlement_task_transactions;
drop table if exists budget_settlement_tasks;
drop table if exists budget_transactions;
drop table if exists budget_transaction_imports;
drop table if exists budget_merchants;
drop table if exists budget_categories;
drop table if exists budget_accounts;

drop type if exists budget_savings_bucket_activity_type;
drop type if exists budget_savings_bucket_status;
drop type if exists budget_settlement_status;
drop type if exists budget_settlement_share_type;
drop type if exists budget_settlement_source_type;
drop type if exists budget_transaction_status;
drop type if exists budget_transaction_type;
drop type if exists budget_goal_behavior;
drop type if exists budget_category_type;
drop type if exists budget_account_type;
drop type if exists budget_account_owner;

create type budget_account_owner as enum ('self', 'spouse', 'joint', 'household');
create type budget_account_type as enum ('checking', 'savings', 'credit_card', 'investment', 'retirement', 'cash', 'other');
create type budget_category_type as enum ('income', 'expense', 'transfer', 'savings');
create type budget_goal_behavior as enum ('keep_under', 'spend_exactly', 'save_at_least', 'track_only');
create type budget_transaction_type as enum ('income', 'expense', 'transfer', 'adjustment');
create type budget_transaction_status as enum ('pending', 'cleared', 'reviewed', 'ignored');
create type budget_settlement_source_type as enum ('bill_split', 'balance_difference', 'purchase_share', 'manual', 'other');
create type budget_settlement_share_type as enum ('half', 'full', 'percentage', 'fixed_amount', 'custom');
create type budget_settlement_status as enum ('pending', 'completed', 'canceled', 'skipped');
create type budget_savings_bucket_status as enum ('active', 'paused', 'completed', 'archived');
create type budget_savings_bucket_activity_type as enum ('allocation', 'withdrawal', 'purchase', 'adjustment');

create table budget_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner budget_account_owner,
  account_type budget_account_type not null default 'checking',
  institution text,
  current_balance numeric(12, 2) not null default 0,
  available_balance numeric(12, 2),
  is_active boolean not null default true,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  group_name text,
  category_type budget_category_type not null default 'expense',
  monthly_goal_amount numeric(12, 2),
  goal_behavior budget_goal_behavior not null default 'track_only',
  is_active boolean not null default true,
  sort_order integer default 0,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_category_id uuid references budget_categories(id) on delete set null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_transaction_imports (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references budget_accounts(id) on delete cascade,
  file_name text not null,
  institution text,
  imported_at timestamp with time zone not null default now(),
  row_count integer not null default 0,
  created_count integer not null default 0,
  skipped_count integer not null default 0,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references budget_accounts(id) on delete cascade,
  category_id uuid references budget_categories(id) on delete set null,
  merchant_id uuid references budget_merchants(id) on delete set null,
  import_id uuid references budget_transaction_imports(id) on delete set null,
  transaction_date date not null,
  description text not null,
  merchant text,
  amount numeric(12, 2) not null,
  transaction_type budget_transaction_type not null,
  status budget_transaction_status not null default 'pending',
  external_id text,
  raw_import_data jsonb,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_settlement_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  payer text not null,
  recipient text not null,
  source_type budget_settlement_source_type not null default 'manual',
  basis_amount numeric(12, 2),
  share_type budget_settlement_share_type not null default 'half',
  share_percentage numeric(5, 2),
  amount_due numeric(12, 2) not null,
  due_date date,
  status budget_settlement_status not null default 'pending',
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_settlement_task_transactions (
  id uuid primary key default gen_random_uuid(),
  settlement_task_id uuid not null references budget_settlement_tasks(id) on delete cascade,
  transaction_id uuid not null references budget_transactions(id) on delete cascade,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique (settlement_task_id, transaction_id)
);

create table budget_savings_buckets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner budget_account_owner,
  target_amount numeric(12, 2),
  current_amount numeric(12, 2) not null default 0,
  status budget_savings_bucket_status not null default 'active',
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table budget_savings_bucket_activity (
  id uuid primary key default gen_random_uuid(),
  bucket_id uuid not null references budget_savings_buckets(id) on delete cascade,
  transaction_id uuid references budget_transactions(id) on delete set null,
  activity_date date not null,
  activity_type budget_savings_bucket_activity_type not null,
  amount numeric(12, 2) not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index budget_transactions_account_id_idx on budget_transactions(account_id);
create index budget_transactions_category_id_idx on budget_transactions(category_id);
create index budget_transactions_transaction_date_idx on budget_transactions(transaction_date);
create index budget_settlement_tasks_status_idx on budget_settlement_tasks(status);
create index budget_savings_bucket_activity_bucket_id_idx on budget_savings_bucket_activity(bucket_id);

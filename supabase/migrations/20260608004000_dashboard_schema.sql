drop table if exists dashboard_attention_items;

drop type if exists dashboard_item_domain;
drop type if exists dashboard_item_status;

create type dashboard_item_domain as enum ('gardening', 'maintenance', 'improvements', 'budgeting');
create type dashboard_item_status as enum ('due_soon', 'blocked', 'needs_review', 'upcoming', 'overdue', 'in_progress', 'action_needed', 'good');

create table dashboard_attention_items (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  domain dashboard_item_domain not null,
  status dashboard_item_status not null,
  due_date date,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index dashboard_attention_items_due_date_idx on dashboard_attention_items(due_date);

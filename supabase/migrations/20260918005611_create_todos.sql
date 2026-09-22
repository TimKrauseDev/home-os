drop table if exists todo;

drop type if exists todo_category;

create type todo_category as enum (
  'Cleaning',
  'Errands',
  'Finance',
  'Garden',
  'General',
  'Home',
  'Maintenance',
  'Shopping'
);

create table todo (
  id uuid primary key default gen_random_uuid(),
  due_date timestamp with time zone,
  title text not null check (length(trim(title)) > 0),
  description text not null default '',
  category todo_category not null default 'General',
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  completed boolean not null default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index todo_completed_date_idx on todo(completed, due_date);
create index todo_category_idx on todo(category);

drop table if exists todos;

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

create table todos (
  id uuid primary key default gen_random_uuid(),
  due_date timestamp with time zone,
  title text not null check (length(trim(title)) > 0),
  category todo_category not null default 'General',
  completed boolean not null default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index todos_completed_date_idx on todos(completed, due_date);
create index todos_category_idx on todos(category);

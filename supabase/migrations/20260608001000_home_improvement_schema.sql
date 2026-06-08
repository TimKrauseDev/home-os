drop table if exists home_improvement_todos;
drop table if exists home_improvement_projects;

drop type if exists home_improvement_todo_status;
drop type if exists home_improvement_priority;
drop type if exists home_improvement_project_status;

create type home_improvement_project_status as enum ('idea', 'planned', 'in_progress', 'blocked', 'completed', 'canceled', 'archived');
create type home_improvement_priority as enum ('low', 'medium', 'high');
create type home_improvement_todo_status as enum ('pending', 'in_progress', 'completed', 'skipped', 'canceled');

create table home_improvement_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status home_improvement_project_status not null default 'idea',
  priority home_improvement_priority not null default 'medium',
  area text,
  target_start_date date,
  target_end_date date,
  completed_at timestamp with time zone,
  estimated_total numeric(12, 2),
  actual_total numeric(12, 2),
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table home_improvement_todos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references home_improvement_projects(id) on delete cascade,
  title text not null,
  notes text,
  status home_improvement_todo_status not null default 'pending',
  due_date date,
  completed_at timestamp with time zone,
  sort_order integer default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index home_improvement_projects_status_idx on home_improvement_projects(status);
create index home_improvement_todos_project_id_idx on home_improvement_todos(project_id);
create index home_improvement_todos_due_date_idx on home_improvement_todos(due_date);

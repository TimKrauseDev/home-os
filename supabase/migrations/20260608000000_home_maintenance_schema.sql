drop table if exists home_maintenance_completions;
drop table if exists home_maintenance_task_cadences;
drop table if exists home_maintenance_tasks;

drop type if exists home_maintenance_cadence_unit;
drop type if exists home_maintenance_cadence_type;
drop type if exists home_maintenance_season;
drop type if exists home_maintenance_priority;
drop type if exists home_maintenance_task_status;
drop type if exists home_maintenance_area;

create type home_maintenance_area as enum ('interior', 'exterior');
create type home_maintenance_task_status as enum ('active', 'in_progress', 'paused', 'archived');
create type home_maintenance_priority as enum ('low', 'medium', 'high');
create type home_maintenance_season as enum ('spring', 'summer', 'fall', 'winter');
create type home_maintenance_cadence_type as enum ('monthly', 'seasonal', 'yearly', 'custom');
create type home_maintenance_cadence_unit as enum ('days', 'weeks', 'months', 'years');

create table home_maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  area home_maintenance_area,
  next_due_date date,
  last_completed_at timestamp with time zone,
  status home_maintenance_task_status not null default 'active',
  priority home_maintenance_priority not null default 'medium',
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table home_maintenance_task_cadences (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references home_maintenance_tasks(id) on delete cascade,
  cadence_type home_maintenance_cadence_type not null,
  cadence_interval integer check (cadence_interval is null or cadence_interval > 0),
  cadence_unit home_maintenance_cadence_unit,
  season home_maintenance_season,
  preferred_month integer check (preferred_month is null or preferred_month between 1 and 12),
  preferred_day integer check (preferred_day is null or preferred_day between 1 and 31),
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table home_maintenance_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references home_maintenance_tasks(id) on delete cascade,
  completed_at timestamp with time zone not null,
  completed_by text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index home_maintenance_tasks_next_due_date_idx on home_maintenance_tasks(next_due_date);
create index home_maintenance_tasks_status_idx on home_maintenance_tasks(status);
create index home_maintenance_task_cadences_task_id_idx on home_maintenance_task_cadences(task_id);
create index home_maintenance_completions_task_id_idx on home_maintenance_completions(task_id);

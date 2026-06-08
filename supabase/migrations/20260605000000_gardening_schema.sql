drop table if exists garden_seed_tasks;
drop table if exists garden_seed_sowing_windows;
drop table if exists garden_seeds;

drop type if exists garden_seed_task_status;
drop type if exists garden_sow_direction;
drop type if exists garden_sow_reference;
drop type if exists garden_sow_method;
drop type if exists garden_sun_type;
drop type if exists garden_seed_depth_inches;

create type garden_sow_method as enum (
  'inside',
  'outside',
  'either'
);

create type garden_sow_reference as enum (
  'last_frost',
  'first_frost'
);

create type garden_sow_direction as enum (
  'before',
  'after'
);

create type garden_sun_type as enum (
  'full_sun',
  'partial_sun',
  'partial_shade',
  'shade',
  'unknown'
);

create type garden_seed_task_status as enum (
  'pending',
  'completed',
  'skipped',
  'canceled'
);

create type garden_seed_depth_inches as enum (
  '0',
  '0.125',
  '0.25',
  '0.5',
  '0.75',
  '1'
);

create table garden_seeds (
  id uuid primary key default gen_random_uuid(),
  location_number text,
  type text not null,
  variety text not null,
  recommended_sow_method garden_sow_method,
  is_succession_planted boolean not null default false,
  succession_interval_days integer check (succession_interval_days is null or succession_interval_days > 0),
  days_to_emerge integer check (days_to_emerge is null or days_to_emerge > 0),
  days_to_maturity integer check (days_to_maturity is null or days_to_maturity > 0),
  seed_depth_inches garden_seed_depth_inches,
  row_spacing_inches integer check (row_spacing_inches is null or row_spacing_inches >= 0),
  is_deer_resistant boolean,
  sun_type garden_sun_type not null default 'unknown',
  purchased_from text,
  source_page_url text,
  source_image_url text,
  overall_rating integer check (overall_rating is null or overall_rating between 1 and 5),
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table garden_seed_sowing_windows (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references garden_seeds(id) on delete cascade,
  sow_method garden_sow_method not null,
  sow_reference garden_sow_reference not null,
  sow_direction garden_sow_direction not null,
  sow_start_weeks integer not null check (sow_start_weeks >= 0),
  sow_end_weeks integer not null check (sow_end_weeks >= sow_start_weeks),
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table garden_seed_tasks (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references garden_seeds(id) on delete cascade,
  title text not null,
  due_date date not null,
  status garden_seed_task_status not null default 'pending',
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index garden_seeds_type_idx on garden_seeds(type);
create index garden_seeds_variety_idx on garden_seeds(variety);
create index garden_seed_sowing_windows_seed_id_idx on garden_seed_sowing_windows(seed_id);
create index garden_seed_tasks_seed_id_idx on garden_seed_tasks(seed_id);
create index garden_seed_tasks_due_date_idx on garden_seed_tasks(due_date);
create index garden_seed_tasks_status_idx on garden_seed_tasks(status);

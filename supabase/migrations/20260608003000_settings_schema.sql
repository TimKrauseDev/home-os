drop table if exists security_controls;
drop table if exists notification_rules;
drop table if exists app_settings;
drop table if exists household_members;

drop type if exists security_control_area;
drop type if exists security_control_status;
drop type if exists notification_channel;
drop type if exists household_member_role;

create type household_member_role as enum ('owner', 'household_member');
create type notification_channel as enum ('email', 'ntfy', 'sms');
create type security_control_status as enum ('planned', 'in_progress', 'active', 'deferred');
create type security_control_area as enum ('hosting', 'auth', 'data', 'exports');

create table household_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role household_member_role not null default 'household_member',
  email text,
  budget_owner text,
  receives_email boolean not null default true,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table app_settings (
  id uuid primary key default gen_random_uuid(),
  setting text not null,
  value text,
  area text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table notification_rules (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  channel notification_channel not null default 'email',
  timing text,
  enabled boolean not null default true,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table security_controls (
  id uuid primary key default gen_random_uuid(),
  control text not null,
  status security_control_status not null default 'planned',
  area security_control_area not null,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

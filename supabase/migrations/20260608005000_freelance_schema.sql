drop table if exists freelance_workflows;

drop type if exists freelance_priority;
drop type if exists freelance_workflow_status;

create type freelance_workflow_status as enum ('reserved', 'future', 'deferred');
create type freelance_priority as enum ('low', 'medium', 'high');

create table freelance_workflows (
  id uuid primary key default gen_random_uuid(),
  workflow text not null,
  status freelance_workflow_status not null default 'future',
  priority freelance_priority not null default 'low',
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

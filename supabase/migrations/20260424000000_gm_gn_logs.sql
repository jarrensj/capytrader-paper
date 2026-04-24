-- Tables to persist daily gm and gn greetings.
-- A player (identified by case-insensitive name) can only say gm once and gn once per UTC day.

create table if not exists public.gm_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.gn_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists gm_logs_name_day_unique
  on public.gm_logs (lower(name), ((created_at at time zone 'utc')::date));

create unique index if not exists gn_logs_name_day_unique
  on public.gn_logs (lower(name), ((created_at at time zone 'utc')::date));

create index if not exists gm_logs_created_at_idx on public.gm_logs (created_at desc);
create index if not exists gn_logs_created_at_idx on public.gn_logs (created_at desc);

alter table public.gm_logs enable row level security;
alter table public.gn_logs enable row level security;

create policy "gm_logs are readable by anyone"
  on public.gm_logs for select
  using (true);

create policy "gm_logs can be inserted by anyone"
  on public.gm_logs for insert
  with check (true);

create policy "gn_logs are readable by anyone"
  on public.gn_logs for select
  using (true);

create policy "gn_logs can be inserted by anyone"
  on public.gn_logs for insert
  with check (true);

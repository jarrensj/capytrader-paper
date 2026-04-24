create table public.messages (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null,
    name text not null check (char_length(name) between 1 and 50),
    text text not null check (char_length(text) between 1 and 200),
    created_at timestamptz not null default now()
);

create index messages_created_at_idx on public.messages (created_at desc);

alter table public.messages enable row level security;

create policy "messages are readable by anyone"
    on public.messages
    for select
    to anon, authenticated
    using (true);

create policy "anyone can insert a message"
    on public.messages
    for insert
    to anon, authenticated
    with check (true);

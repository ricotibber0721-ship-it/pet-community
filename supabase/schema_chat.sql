-- =============================================================
-- Pet Community - Chat schema (run in Supabase SQL Editor)
-- =============================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) between 1 and 1000),
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_email text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages(created_at);

alter table public.messages enable row level security;

drop policy if exists "Anyone can view messages" on public.messages;
create policy "Anyone can view messages"
  on public.messages for select
  using (true);

drop policy if exists "Authenticated users can send messages" on public.messages;
create policy "Authenticated users can send messages"
  on public.messages for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Enable Realtime broadcasting for INSERTs on this table
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
    and schemaname = 'public'
    and tablename = 'messages'
  ) then
    execute 'alter publication supabase_realtime add table public.messages';
  end if;
end $$;

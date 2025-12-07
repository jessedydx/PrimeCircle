-- Create user_stats table
create table if not exists public.user_stats (
  fid bigint primary key,
  username text,
  display_name text,
  follower_count int,
  following_count int,
  api_calls int default 0,
  items_fetched int default 0,
  last_active timestamp with time zone default timezone('utc'::text, now()),
  purchased_low_score boolean default false,
  purchased_one_way boolean default false,
  purchased_opportunities boolean default false,
  access_source_low_score text,
  access_source_one_way text,
  access_source_opportunities text
);

-- Create notification_tokens table
create table if not exists public.notification_tokens (
  fid bigint,
  token text primary key,
  notification_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) if needed, or leave open for now since we use server-side keys
alter table public.user_stats enable row level security;
alter table public.notification_tokens enable row level security;

-- Create policies to allow all access for now (since we use service role/anon key in specific ways)
-- Ideally you'd restrict this more, but for this dashboard to work simply:
create policy "Enable read access for all users" on public.user_stats for select using (true);
create policy "Enable insert/update for service role" on public.user_stats for all using (true);

create policy "Enable read access for all users" on public.notification_tokens for select using (true);
create policy "Enable all access for service role" on public.notification_tokens for all using (true);

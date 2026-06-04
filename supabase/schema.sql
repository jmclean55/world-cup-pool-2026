-- Entries: one row per pool participant
create table entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text,
  -- team picks: one per tier (tier1..tier8)
  team_tier1 text not null,
  team_tier2 text not null,
  team_tier3 text not null,
  team_tier4 text not null,
  team_tier5 text not null,
  team_tier6 text not null,
  team_tier7 text not null,
  team_tier8 text not null,
  -- player picks: one per tier (tier1..tier5)
  player_tier1 text not null,
  player_tier2 text not null,
  player_tier3 text not null,
  player_tier4 text not null,
  player_tier5 text not null,
  -- computed scores (updated by admin)
  team_points numeric default 0,
  player_points numeric default 0,
  total_points numeric generated always as (team_points + player_points) stored
);

-- Team stats: one row per team, updated by admin as tournament progresses
create table team_stats (
  id uuid primary key default gen_random_uuid(),
  team_name text unique not null,
  odds integer not null default 0,
  group_wins integer default 0,
  group_draws integer default 0,
  group_losses integer default 0,
  group_winner boolean default false,
  knockout_advance boolean default false,
  round_of_32_wins integer default 0,
  round_of_16_wins integer default 0,
  quarter_final_wins integer default 0,
  semi_final_wins integer default 0,
  champion boolean default false,
  upset_wins integer default 0
);

-- Player stats: one row per player, updated by admin
create table player_stats (
  id uuid primary key default gen_random_uuid(),
  player_name text unique not null,
  odds integer not null default 0,
  group_goals integer default 0,
  knockout_goals numeric default 0
);

-- Settings: key/value store for admin config
create table settings (
  key text primary key,
  value text not null
);

-- Default settings
insert into settings (key, value) values
  ('picks_locked', 'false'),
  ('lock_time', '2026-06-11T16:00:00Z');

-- Enable row-level security (read-only public, admin writes via service key)
alter table entries enable row level security;
alter table team_stats enable row level security;
alter table player_stats enable row level security;
alter table settings enable row level security;

create policy "public read entries" on entries for select using (true);
create policy "public insert entries" on entries for insert with check (true);
create policy "public read team_stats" on team_stats for select using (true);
create policy "public read player_stats" on player_stats for select using (true);
create policy "public read settings" on settings for select using (true);

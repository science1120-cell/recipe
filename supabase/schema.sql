-- Recipes Journal schema
-- Run in Supabase SQL editor.

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  photo_url text,
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  collection_tag text not null default 'All',
  mood_emoji text,
  cooked_on date not null default current_date,
  servings int not null default 1,
  time_min int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create index if not exists recipes_user_updated_idx on public.recipes (user_id, updated_at desc);
create index if not exists recipes_collection_idx on public.recipes (user_id, collection_tag);

alter table public.recipes enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "recipes_owner_all" on public.recipes;
create policy "recipes_owner_all" on public.recipes
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "favorites_owner_all" on public.favorites;
create policy "favorites_owner_all" on public.favorites
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


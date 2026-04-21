-- ============================================================
-- HUARACHÓN ELITE — Unified Supabase Schema
-- Shared by: Flutter Mobile App + Next.js Web App
-- Project: cnuvfblsilouuahitpij
-- Version: 2.0 (Reality-Sync)
-- ============================================================

-- ── Enable UUID extension ──
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: profiles
-- Maps 1-to-1 with auth.users. Synced across both apps.
-- ============================================================
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  phone_number    text,
  avatar_url      text,
  favorite_meat   text,           -- Preference: Asada, Pastor, Tripa, Buche
  favorite_tortilla text,
  favorite_spice  text,
  balance         numeric(10,2) not null default 100.00,  -- Welcome points
  visit_count     int            not null default 0,
  tier            text           not null default 'bronce' check (tier in ('bronce', 'plata', 'oro')),
  referral_code   text           unique,
  last_share_date date,
  birthday        date,
  notif_offers    boolean        not null default true,
  notif_orders    boolean        not null default true,
  created_at      timestamptz    not null default now(),
  updated_at      timestamptz    not null default now()
);

-- Auto-update timestamp
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- Auto-create profile on sign-up (runs server-side)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'HUARA-' || upper(substr(md5(new.id::text), 1, 8))
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- TABLE: orders
-- Shared order history. Both apps read/write here.
-- ============================================================
create table if not exists public.orders (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  branch      text not null,
  total       numeric(10,2) not null,
  items       jsonb not null default '[]',   -- Array of cart items
  status      text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'completed')),
  points_earned numeric(10,2) not null default 0,
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by user
create index if not exists orders_user_id_idx on public.orders(user_id);


-- ============================================================
-- TABLE: challenges
-- Huara-Challenges for the engagement system.
-- ============================================================
create table if not exists public.challenges (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null,
  reward_pts  numeric(10,2) not null default 50,
  expires_at  timestamptz,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.user_challenges (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, challenge_id)
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only see and modify their own data.
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.orders        enable row level security;
alter table public.user_challenges enable row level security;

-- Profiles: user can read/update their own
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Orders: user can read/insert their own
create policy "Users can view own orders"   on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Challenges: anyone can read, user can complete
create policy "Anyone can read challenges"        on public.challenges       for select using (true);
create policy "Users can view own completions"    on public.user_challenges  for select using (auth.uid() = user_id);
create policy "Users can insert own completions"  on public.user_challenges  for insert with check (auth.uid() = user_id);


-- ============================================================
-- SEED: Default menu challenges
-- ============================================================
insert into public.challenges (title, description, reward_pts) values
  ('Primera Orden', 'Haz tu primer pedido en la app y gana puntos de bienvenida.', 150),
  ('Huarafan Social', 'Comparte El Huarachón en redes sociales 3 días seguidos.', 60),
  ('Racha Taquera', 'Visita El Huarachón 5 veces este mes.', 100),
  ('Conoce el Menú', 'Prueba 3 diferentes tipos de carne en tus pedidos.', 80)
on conflict do nothing;

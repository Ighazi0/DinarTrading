-- Schema initialization for GlobalTrade Co.

-- Banners
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  created_at timestamp with time zone default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  in_stock integer default 0,
  created_at timestamp with time zone default now()
);

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brief text not null,
  description text,
  image_url text,
  slug text unique not null,
  created_at timestamp with time zone default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text,
  notes text,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

-- Site settings (optional; for About page content)
create table if not exists public.site_settings (
  id bigint primary key default 1,
  about_content text,
  about_image_url text,
  updated_at timestamp with time zone default now()
);

insert into public.site_settings (id, about_content)
values (1, 'About content here')
on conflict (id) do nothing;

-- NOTE:
-- For simplicity, RLS is not enabled in this starter. In production, enable RLS and add appropriate policies.
-- You can run:
--   alter table public.banners enable row level security;
-- ... and create policies for read/write as needed.

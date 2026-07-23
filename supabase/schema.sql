-- Execute this script once in Supabase: SQL Editor > New query.
-- Then create the first store-manager account in Authentication > Users.

create extension if not exists "uuid-ossp";

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  store_name text not null default 'Sua Loja',
  tagline text not null default 'Moda escolhida para acompanhar a sua história.',
  hero_title text not null default 'Vista-se de presença.',
  hero_text text not null default 'Peças selecionadas para você.',
  hero_image_url text not null default 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85',
  whatsapp_number text not null default '5511999999999',
  instagram_url text,
  instagram_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('Feminino', 'Masculino')),
  description text not null,
  image_urls text[] not null default '{}',
  price numeric(10,2),
  show_price boolean not null default false,
  published boolean not null default true,
  featured boolean not null default false,
  display_order integer not null default 0,
  whatsapp_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instagram_items (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  post_url text,
  alt_text text not null default 'Post da loja no Instagram',
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.instagram_items enable row level security;

create policy "Public can view store settings" on public.site_settings for select using (true);
create policy "Managers can manage store settings" on public.site_settings for all to authenticated using (true) with check (true);
create policy "Public can view published products" on public.products for select using (published = true);
create policy "Managers can view all products" on public.products for select to authenticated using (true);
create policy "Managers can create products" on public.products for insert to authenticated with check (true);
create policy "Managers can update products" on public.products for update to authenticated using (true) with check (true);
create policy "Managers can remove products" on public.products for delete to authenticated using (true);
create policy "Public can view instagram items" on public.instagram_items for select using (true);
create policy "Managers can manage instagram items" on public.instagram_items for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = true;
create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Managers can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "Managers can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
create policy "Managers can remove product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

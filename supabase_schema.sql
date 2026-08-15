-- Florucci — Supabase sxemasi
-- Buni Supabase Dashboard > SQL Editor'da ishga tushiring

create extension if not exists "pgcrypto";

-- Mahsulotlar
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  old_price numeric,
  category text,
  tag text, -- 'new' | 'sale' | null
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- Buyurtmalar
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  total numeric not null default 0,
  status text not null default 'yangi',
  created_at timestamptz default now()
);

-- Buyurtma tarkibi
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  price numeric not null,
  qty integer not null default 1
);

-- Row Level Security
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Mahsulotlarni hamma ko'ra oladi (ochiq katalog)
create policy "Public can view products"
  on products for select
  using (true);

-- Faqat login qilgan admin mahsulot qo'sha/tahrirlay/o'chira oladi
create policy "Admins can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Admins can update products"
  on products for update
  to authenticated
  using (true);

create policy "Admins can delete products"
  on products for delete
  to authenticated
  using (true);

-- Har kim buyurtma bera oladi (checkout formadan)
create policy "Anyone can create an order"
  on orders for insert
  with check (true);

create policy "Anyone can add order items"
  on order_items for insert
  with check (true);

-- Faqat admin buyurtmalarni ko'ra/yangilay oladi
create policy "Admins can view orders"
  on orders for select
  to authenticated
  using (true);

create policy "Admins can update orders"
  on orders for update
  to authenticated
  using (true);

create policy "Admins can view order items"
  on order_items for select
  to authenticated
  using (true);

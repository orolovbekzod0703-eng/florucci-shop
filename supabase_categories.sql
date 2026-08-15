-- Florucci — Kategoriyalarni boshqarish
-- supabase_customer_auth.sql'dan KEYIN, SQL Editor'da ishga tushiring

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Public can view categories"
  on categories for select
  using (true);

create policy "Only admins can add categories"
  on categories for insert
  to authenticated
  with check (auth.uid() in (select user_id from admin_users));

create policy "Only admins can update categories"
  on categories for update
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

create policy "Only admins can delete categories"
  on categories for delete
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

-- Avvaldan mavjud kategoriyalarni saqlab qolish uchun
insert into categories (label, slug) values
  ('O''yinchoq va kitob', 'toys'),
  ('Qizlar kiyimi', 'girls'),
  ('O''g''il bolalar', 'boys'),
  ('Bolalar xonasi', 'nursery'),
  ('Sovg''alar', 'gifts')
on conflict (slug) do nothing;

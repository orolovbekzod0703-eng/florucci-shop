-- Florucci — Admin kirishni cheklash
-- Bu skriptni supabase_schema.sql'dan KEYIN, SQL Editor'da ishga tushiring

-- 1. Ruxsat berilgan adminlar ro'yxati
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;

create policy "Users can check their own admin status"
  on admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- 2. Eski, "har qanday login qilgan foydalanuvchi" qoidalarini o'chiramiz
drop policy if exists "Admins can insert products" on products;
drop policy if exists "Admins can update products" on products;
drop policy if exists "Admins can delete products" on products;
drop policy if exists "Admins can view orders" on orders;
drop policy if exists "Admins can update orders" on orders;
drop policy if exists "Admins can view order items" on order_items;

-- 3. Yangi qoidalar — faqat admin_users jadvalida bo'lgan foydalanuvchilarga ruxsat
create policy "Only admins can insert products"
  on products for insert
  to authenticated
  with check (auth.uid() in (select user_id from admin_users));

create policy "Only admins can update products"
  on products for update
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

create policy "Only admins can delete products"
  on products for delete
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

create policy "Only admins can view orders"
  on orders for select
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

create policy "Only admins can update orders"
  on orders for update
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

create policy "Only admins can view order items"
  on order_items for select
  to authenticated
  using (auth.uid() in (select user_id from admin_users));

-- 4. O'zingizni admin sifatida qo'shing:
--    a) Authentication > Users bo'limida yaratgan foydalanuvchingizning UID'ini nusxalang
--    b) Quyidagi qatorni UID bilan almashtirib, alohida ishga tushiring:
--
-- insert into admin_users (user_id) values ('BU_YERGA_OZ_UID_INGIZNI_QOYING');

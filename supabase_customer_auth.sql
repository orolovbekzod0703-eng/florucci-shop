-- Florucci — Buyurtma berish uchun ro'yxatdan o'tishni majburiy qilish
-- supabase_storage.sql'dan KEYIN, SQL Editor'da ishga tushiring

-- 1. Har bir buyurtmani mijoz hisobiga bog'laymiz
alter table orders add column if not exists user_id uuid references auth.users(id);

-- 2. Eski "har kim buyurtma bera oladi" qoidalarini o'chiramiz
drop policy if exists "Anyone can create an order" on orders;
drop policy if exists "Anyone can add order items" on order_items;

-- 3. Endi faqat ro'yxatdan o'tgan (login qilgan) mijozlar buyurtma bera oladi,
--    va faqat o'z nomiga buyurtma yaratishlari mumkin
create policy "Logged in customers can create orders"
  on orders for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Logged in customers can add order items"
  on order_items for insert
  to authenticated
  with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- MUHIM: Bu skriptdan oldin "Allow new users to sign up"ni o'chirgan bo'lsangiz,
-- Authentication > Providers > Email bo'limida uni QAYTA YOQING — aks holda
-- mijozlar ro'yxatdan o'ta olmaydi. Admin xavfsizligi endi admin_users jadvali
-- orqali ta'minlanadi, shuning uchun umumiy ro'yxatdan o'tishni yopish shart emas.
--
-- Shuningdek, Authentication > Providers > Email'da "Confirm email"ni
-- O'CHIRIB QO'YISH tavsiya etiladi — aks holda mijoz ro'yxatdan o'tgach,
-- pochtasini tasdiqlamaguncha buyurtma berolmaydi.

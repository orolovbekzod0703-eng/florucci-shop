-- Florucci — Mahsulot rasmlari uchun Storage bucket
-- supabase_admin_lockdown.sql'dan KEYIN, SQL Editor'da ishga tushiring

-- 1. Bucket yaratish (ochiq o'qish uchun, saytda rasm ko'rinishi kerak)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Har kim rasmlarni ko'ra oladi (sayt uchun shart)
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Faqat ro'yxatdagi adminlar rasm yuklay oladi
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and auth.uid() in (select user_id from admin_users)
  );

-- 4. Faqat adminlar rasmni o'chira oladi
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and auth.uid() in (select user_id from admin_users)
  );

-- Florucci — Mahsulot qoldig'i sonini kuzatish
-- supabase_location.sql'dan KEYIN, SQL Editor'da ishga tushiring

alter table products add column if not exists stock_qty integer;

-- Buyurtma tushganda qoldiqni xavfsiz (atomik) kamaytiradigan funksiya.
-- SECURITY DEFINER bo'lgani uchun mijozlar to'g'ridan-to'g'ri products jadvalini
-- o'zgartira olmaydi, faqat shu funksiya orqali (RLS'ni chetlab o'tadi, lekin
-- faqat shu tor vazifani bajaradi).
create or replace function decrement_stock(p_product_id uuid, p_qty integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products
  set
    stock_qty = greatest(coalesce(stock_qty, 0) - p_qty, 0),
    in_stock = (greatest(coalesce(stock_qty, 0) - p_qty, 0) > 0)
  where id = p_product_id
    and stock_qty is not null;
end;
$$;

grant execute on function decrement_stock(uuid, integer) to authenticated;

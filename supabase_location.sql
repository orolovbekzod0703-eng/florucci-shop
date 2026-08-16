-- Florucci — Xaritadan yetkazib berish joyini saqlash
-- supabase_categories.sql'dan KEYIN, SQL Editor'da ishga tushiring

alter table orders add column if not exists lat numeric;
alter table orders add column if not exists lng numeric;

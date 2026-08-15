# Florucci — Baby Boutique

React + Vite + Supabase asosida qurilgan bolalar buyumlari onlayn do'koni.

## 1. Supabase'ni sozlash

1. Supabase Dashboard'ga kiring → loyihangizni tanlang (`cplrwaokxnpnjimkzbop`)
2. Chap menyudan **SQL Editor**'ni oching
3. `supabase_schema.sql` faylining butun tarkibini nusxalab, SQL Editor'ga joylashtiring va **Run** tugmasini bosing — bu `products`, `orders`, `order_items` jadvallarini va xavfsizlik qoidalarini (RLS) yaratadi
4. **Authentication → Users** bo'limiga o'ting va o'zingiz uchun admin foydalanuvchi yarating (email + parol) — bu admin panelga kirish uchun login bo'ladi

## 2. Loyihani lokal ishga tushirish

```bash
npm install
npm run dev
```

`.env` faylida Supabase URL va anon kalit allaqachon joylashtirilgan.

## 3. Admin panel

`/admin/login` manziliga o'ting va Supabase'da yaratgan admin email/parolingiz bilan kiring. U yerdan:
- Mahsulot qo'shish, tahrirlash, o'chirish
- Buyurtmalarni ko'rish va holatini yangilash (yangi → tayyorlanmoqda → yuborildi → yetkazildi)

## 4. Vercel'ga deploy qilish

1. Loyihani GitHub'ga yuklang
2. [vercel.com](https://vercel.com) → **New Project** → repo'ni tanlang
3. **Environment Variables** bo'limiga quyidagilarni qo'shing:
   - `VITE_SUPABASE_URL` = `https://cplrwaokxnpnjimkzbop.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (anon kalitingiz)
4. **Deploy** tugmasini bosing

Build buyrug'i: `npm run build`, chiqish papkasi: `dist` (Vercel avtomatik aniqlaydi, chunki bu Vite loyihasi).

## Eslatma

`.env` fayli `.gitignore`ga kiritilgan — GitHub'ga yuklaganda kalitlar oshkor bo'lmaydi. Deploy paytida ularni Vercel muhit o'zgaruvchilariga qo'lda kiritishingiz kerak (3-qadamga qarang).

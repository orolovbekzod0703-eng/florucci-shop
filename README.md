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

## 3. Adminlarni cheklash (muhim!)

Standart holatda Supabase login qilgan har qanday foydalanuvchiga ruxsat berardi. Buni tuzatish uchun:

1. SQL Editor'da `supabase_admin_lockdown.sql` faylini ishga tushiring
2. **Authentication → Users**'da o'zingiz yaratgan foydalanuvchining UID'ini nusxalang
3. SQL Editor'da: `insert into admin_users (user_id) values ('UID_INGIZ');`
4. **Authentication → Providers → Email**'da "Allow new users to sign up" ni **o'chirib qo'ying** — shunda hech kim o'zi ro'yxatdan o'ta olmaydi, faqat siz dashboard orqali qo'shgan foydalanuvchilar kira oladi

Yangi admin qo'shmoqchi bo'lsangiz: Authentication → Users'da yangi user yarating, so'ng uning UID'ini `admin_users` jadvaliga qo'shing.

## 4. Admin panel

`/admin/login` manziliga o'ting va Supabase'da yaratgan admin email/parolingiz bilan kiring. U yerdan:
- Mahsulot qo'shish, tahrirlash, o'chirish
- Buyurtmalarni ko'rish va holatini yangilash (yangi → tayyorlanmoqda → yuborildi → yetkazildi)

## 5. Vercel'ga deploy qilish

1. Loyihani GitHub'ga yuklang
2. [vercel.com](https://vercel.com) → **New Project** → repo'ni tanlang
3. **Environment Variables** bo'limiga quyidagilarni qo'shing:
   - `VITE_SUPABASE_URL` = `https://cplrwaokxnpnjimkzbop.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (anon kalitingiz)
4. **Deploy** tugmasini bosing

Build buyrug'i: `npm run build`, chiqish papkasi: `dist` (Vercel avtomatik aniqlaydi, chunki bu Vite loyihasi).

## Eslatma

`.env` fayli `.gitignore`ga kiritilgan — GitHub'ga yuklaganda kalitlar oshkor bo'lmaydi. Deploy paytida ularni Vercel muhit o'zgaruvchilariga qo'lda kiritishingiz kerak (3-qadamga qarang).

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

## 4. Rasm yuklashni yoqish

Admin panelda mahsulotga rasm to'g'ridan-to'g'ri kompyuteringizdan yuklanadi (Supabase Storage'da saqlanadi). Buni faollashtirish uchun:

1. SQL Editor'da `supabase_storage.sql` faylini ishga tushiring — bu `product-images` nomli bucket yaratadi va faqat adminlarga yuklash/o'chirish huquqini beradi
2. Boshqa hech narsa kerak emas — admin paneldagi "Mahsulot rasmi" maydonidan fayl tanlab yuklashingiz mumkin

## 5. Mijozlar uchun ro'yxatdan o'tish

Mahsulotlarni har kim mehmon sifatida ko'ra oladi, lekin buyurtma berish uchun hisob (email + parol) kerak bo'ladi.

1. SQL Editor'da `supabase_storage.sql`'dan KEYIN `supabase_customer_auth.sql` faylini ishga tushiring
2. **Authentication → Providers → Email** bo'limida:
   - "Allow new users to sign up" **YOQILGAN** bo'lishi kerak (agar admin xavfsizligi uchun avval o'chirgan bo'lsangiz, qayta yoqing — endi admin xavfsizligi `admin_users` jadvali orqali ta'minlanadi, umumiy ro'yxatdan o'tishni yopish shart emas)
   - "Confirm email"ni **o'chirib qo'yish** tavsiya etiladi — aks holda mijoz ro'yxatdan o'tgach, pochtasini tasdiqlamaguncha buyurtma berolmaydi

## 6. Kategoriyalarni boshqarish

Kategoriyalar endi bazada saqlanadi, admin panel orqali yangi kategoriya qo'shishingiz mumkin.

1. SQL Editor'da `supabase_categories.sql` faylini ishga tushiring — bu avvalgi 5 ta kategoriyangizni saqlab qolgan holda `categories` jadvalini yaratadi
2. Admin panel → Mahsulotlar → forma ichidagi "Kategoriya" maydonining ostida yangi kategoriya nomini yozib "Qo'shish"ni bosing — u darhol tanlov ro'yxatiga va saytga qo'shiladi
3. Agar biror kategoriyada hali mahsulot bo'lmasa, saytda "Bu bo'limga hali mahsulot qo'shilmagan" deb ko'rsatiladi (kategoriya yashirinmaydi)

## 7. Xaritadan yetkazib berish joyi

Buyurtma berishda mijoz xaritadan (bepul OpenStreetMap, Google'ning pullik API kaliti shart emas) o'z joyini belgilaydi.

1. SQL Editor'da `supabase_location.sql` faylini ishga tushiring
2. Boshqa hech narsa kerak emas — checkout formasida xarita avtomatik chiqadi
3. Admin panelda buyurtmani ochsangiz, "📍 Xaritada ko'rish" havolasi orqali Google Maps'da ochib ko'rishingiz mumkin

## 8. Telegram xabarnomasi

Yangi buyurtma tushganda botingizga avtomatik xabar keladi.

1. Botingizga (BotFather orqali yaratgan) o'zingiz Telegram'da yozing, masalan "salom" deb — bu bot sizni "ko'rishi" uchun kerak
2. Brauzeringizda shu manzilga o'ting (TOKEN o'rniga bot tokeningizni qo'ying):
   `https://api.telegram.org/botTOKEN/getUpdates`
3. Chiqqan JSON ichidan `"chat":{"id":...}` qiymatini toping — bu sizning `chat_id`ingiz
4. Vercel Dashboard → loyihangiz → **Settings → Environment Variables**'ga qo'shing:
   - `TELEGRAM_BOT_TOKEN` = bot tokeningiz
   - `TELEGRAM_CHAT_ID` = topgan chat_id
5. Qayta deploy qiling

**Eslatma:** bu funksiya faqat Vercel'da ishlaydi (`npm run dev` bilan lokal ishga tushirganda emas), chunki u serverless funksiya. Token hech qachon kodga yoki GitHub'ga yozilmaydi — faqat Vercel'ning maxfiy muhit o'zgaruvchisida turadi.

## 9. Admin panel

`/admin/login` manziliga o'ting va Supabase'da yaratgan admin email/parolingiz bilan kiring. U yerdan:
- Mahsulot qo'shish, tahrirlash, o'chirish
- Buyurtmalarni ko'rish va holatini yangilash (yangi → tayyorlanmoqda → yuborildi → yetkazildi)

## 10. Vercel'ga deploy qilish

1. Loyihani GitHub'ga yuklang
2. [vercel.com](https://vercel.com) → **New Project** → repo'ni tanlang
3. **Environment Variables** bo'limiga quyidagilarni qo'shing:
   - `VITE_SUPABASE_URL` = `https://cplrwaokxnpnjimkzbop.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (anon kalitingiz)
4. **Deploy** tugmasini bosing

Build buyrug'i: `npm run build`, chiqish papkasi: `dist` (Vercel avtomatik aniqlaydi, chunki bu Vite loyihasi).

`vercel.json` fayli allaqachon qo'shilgan — bu `/admin/login` kabi sahifalarga to'g'ridan-to'g'ri kirilganda 404 chiqmasligini ta'minlaydi. Agar avval deploy qilgan bo'lsangiz, bu o'zgarishni olish uchun qayta deploy qiling (GitHub'ga push qilinganda Vercel avtomatik qayta deploy qiladi).

## Eslatma

`.env` fayli `.gitignore`ga kiritilgan — GitHub'ga yuklaganda kalitlar oshkor bo'lmaydi. Deploy paytida ularni Vercel muhit o'zgaruvchilariga qo'lda kiritishingiz kerak (3-qadamga qarang).

// Admin foydalanuvchi yaratish skripti.
// FAQAT O'ZINGIZ, LOKAL KOMPYUTERINGIZDA ishga tushiring — bu skript
// service_role kalitini talab qiladi, uni hech kimga (shu jumladan Claude'ga) yubormang.
//
// Ishlatish:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin.mjs email@example.com parolingiz123

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cplrwaokxnpnjimkzbop.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const [, , email, password] = process.argv

if (!serviceRoleKey) {
  console.error('Xato: SUPABASE_SERVICE_ROLE_KEY muhit o\'zgaruvchisi berilmagan.')
  console.error('Supabase Dashboard > Project Settings > API > service_role kalitini oling.')
  process.exit(1)
}

if (!email || !password) {
  console.error('Ishlatish: SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-admin.mjs email@example.com parol123')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // darhol tasdiqlangan holda yaratiladi, login qilish uchun tayyor
})

if (error) {
  console.error('Xatolik:', error.message)
  process.exit(1)
}

console.log('Admin foydalanuvchi yaratildi:', data.user.email)
console.log('Endi /admin/login sahifasida shu email va parol bilan kirishingiz mumkin.')

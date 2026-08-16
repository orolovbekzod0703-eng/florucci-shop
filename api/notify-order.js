// Vercel serverless funksiyasi — /api/notify-order
// Bot tokeni bu yerda emas, Vercel Environment Variables'da saqlanadi (xavfsiz).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Telegram sozlanmagan (env var yo\'q)' })
  }

  const { customerName, phone, address, total, items, lat, lng } = req.body || {}

  const itemsText = (items || [])
    .map(i => `• ${i.name} ×${i.qty} — ${Number(i.price * i.qty).toLocaleString('uz-UZ')} so'm`)
    .join('\n')

  const mapLine = (lat && lng) ? `\n📍 Xarita: https://www.google.com/maps?q=${lat},${lng}\n` : ''

  const text =
    `🛍 Yangi buyurtma!\n\n` +
    `Mijoz: ${customerName}\n` +
    `Telefon: ${phone}\n` +
    (address ? `Manzil izohi: ${address}\n` : '') +
    mapLine +
    `\n${itemsText}\n\n` +
    `Jami: ${Number(total).toLocaleString('uz-UZ')} so'm`

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    const data = await tgRes.json()
    if (!data.ok) {
      return res.status(500).json({ error: data.description || 'Telegram xatoligi' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

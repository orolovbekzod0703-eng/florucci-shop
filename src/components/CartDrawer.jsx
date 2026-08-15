import { useState } from 'react'
import { useCart } from '../lib/CartContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function CartDrawer() {
  const { items, removeItem, setQty, total, open, setOpen, clear } = useCart()
  const [step, setStep] = useState('cart') // cart | checkout | done
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function submitOrder(e) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setError('Ism va telefon raqamni kiriting')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          total,
          status: 'yangi',
        })
        .select()
        .single()

      if (orderErr) throw orderErr

      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        price: i.price,
        qty: i.qty,
      }))
      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
      if (itemsErr) throw itemsErr

      setStep('done')
      clear()
    } catch (err) {
      setError('Xatolik yuz berdi: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function close() {
    setOpen(false)
    setStep('cart')
    setForm({ name: '', phone: '', address: '' })
    setError('')
  }

  return (
    <div style={overlayStyle} onClick={close}>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        <div style={headStyle}>
          <h3 style={{ fontSize: 20 }}>
            {step === 'cart' && 'Savat'}
            {step === 'checkout' && "Buyurtmani rasmiylashtirish"}
            {step === 'done' && 'Rahmat!'}
          </h3>
          <button onClick={close} style={closeBtn}>✕</button>
        </div>

        {step === 'cart' && (
          <>
            {items.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', padding: '20px 0' }}>Savatingiz bo'sh</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '18px 0' }}>
                {items.map(i => (
                  <div key={i.id} style={itemRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{i.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{Number(i.price).toLocaleString('uz-UZ')} so'm</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button style={qtyBtn} onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                      <span style={{ minWidth: 18, textAlign: 'center' }}>{i.qty}</span>
                      <button style={qtyBtn} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                    </div>
                    <button style={removeBtn} onClick={() => removeItem(i.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {items.length > 0 && (
              <>
                <div style={totalRow}>
                  <span>Jami</span>
                  <strong>{total.toLocaleString('uz-UZ')} so'm</strong>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={() => setStep('checkout')}>
                  Buyurtma berish →
                </button>
              </>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form onSubmit={submitOrder} style={{ marginTop: 18 }}>
            <div className="field">
              <label>Ismingiz</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ismingiz" />
            </div>
            <div className="field">
              <label>Telefon raqam</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" />
            </div>
            <div className="field">
              <label>Manzil (ixtiyoriy)</label>
              <textarea rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Yetkazib berish manzili" />
            </div>
            {error && <p style={{ color: 'var(--coral)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <div style={totalRow}>
              <span>Jami</span>
              <strong>{total.toLocaleString('uz-UZ')} so'm</strong>
            </div>
            <button className="btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
              {submitting ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div style={{ padding: '30px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 20 }}>
              Buyurtmangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
            </p>
            <button className="btn-primary" onClick={close}>Yopish</button>
          </div>
        )}
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(51,38,31,0.4)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }
const drawerStyle = { width: 400, maxWidth: '92vw', height: '100%', background: 'var(--cream)', padding: '24px 24px 30px', overflowY: 'auto' }
const headStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const closeBtn = { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }
const itemRow = { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '10px 12px', borderRadius: 14, border: '1px solid var(--line)' }
const qtyBtn = { width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--line)', background: '#fff', fontSize: 15 }
const removeBtn = { background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 14 }
const totalRow = { display: 'flex', justifyContent: 'space-between', fontSize: 15, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }

import { useState, useEffect } from 'react'
import { useCart } from '../lib/CartContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function CartDrawer() {
  const { items, removeItem, setQty, total, open, setOpen, clear } = useCart()
  const [step, setStep] = useState('cart') // cart | auth | checkout | done
  const [session, setSession] = useState(null)

  const [authMode, setAuthMode] = useState('login') // login | register
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!open) return null

  function goToCheckout() {
    if (session) {
      const meta = session.user.user_metadata || {}
      setForm(f => ({ ...f, name: meta.name || f.name, phone: meta.phone || f.phone }))
      setStep('checkout')
    } else {
      setStep('auth')
    }
  }

  async function handleAuth(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthNotice('')

    if (authMode === 'register') {
      if (!authForm.name || !authForm.phone) {
        setAuthError('Ism va telefon raqamni kiriting')
        setAuthLoading(false)
        return
      }
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: { data: { name: authForm.name, phone: authForm.phone } },
      })
      setAuthLoading(false)
      if (error) { setAuthError(error.message); return }
      if (!data.session) {
        setAuthNotice("Ro'yxatdan o'tdingiz. Agar pochta tasdiqlash yoqilgan bo'lsa, emailingizni tasdiqlab, so'ng qayta kiring.")
        setAuthMode('login')
        return
      }
      setSession(data.session)
      setForm(f => ({ ...f, name: authForm.name, phone: authForm.phone }))
      setStep('checkout')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      })
      setAuthLoading(false)
      if (error) { setAuthError("Email yoki parol noto'g'ri"); return }
      setSession(data.session)
      const meta = data.session.user.user_metadata || {}
      setForm(f => ({ ...f, name: meta.name || f.name, phone: meta.phone || f.phone }))
      setStep('checkout')
    }
  }

  async function submitOrder(e) {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setError('Ism va telefon raqamni kiriting')
      return
    }
    if (!session) {
      setStep('auth')
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
          user_id: session.user.id,
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
    setAuthForm({ email: '', password: '', name: '', phone: '' })
    setError('')
    setAuthError('')
    setAuthNotice('')
  }

  return (
    <div style={overlayStyle} onClick={close}>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        <div style={headStyle}>
          <h3 style={{ fontSize: 20 }}>
            {step === 'cart' && 'Savat'}
            {step === 'auth' && (authMode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish")}
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
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={goToCheckout}>
                  Buyurtma berish →
                </button>
              </>
            )}
          </>
        )}

        {step === 'auth' && (
          <div style={{ marginTop: 18 }}>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Buyurtma berish uchun hisobingiz bo'lishi kerak. Mahsulotlarni ko'rish uchun hisob shart emas.
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthNotice('') }}
                style={authTabBtn(authMode === 'login')}
              >Kirish</button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthNotice('') }}
                style={authTabBtn(authMode === 'register')}
              >Ro'yxatdan o'tish</button>
            </div>
            <form onSubmit={handleAuth}>
              {authMode === 'register' && (
                <>
                  <div className="field">
                    <label>Ismingiz</label>
                    <input value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label>Telefon raqam</label>
                    <input value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} placeholder="+998 90 123 45 67" required />
                  </div>
                </>
              )}
              <div className="field">
                <label>Email</label>
                <input type="email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} required />
              </div>
              <div className="field">
                <label>Parol</label>
                <input type="password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required minLength={6} />
              </div>
              {authError && <p style={{ color: 'var(--coral)', fontSize: 13, marginBottom: 12 }}>{authError}</p>}
              {authNotice && <p style={{ color: 'var(--olive)', fontSize: 13, marginBottom: 12 }}>{authNotice}</p>}
              <button className="btn-primary" type="submit" disabled={authLoading} style={{ width: '100%', justifyContent: 'center' }}>
                {authLoading ? '...' : authMode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
              </button>
            </form>
          </div>
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
function authTabBtn(active) {
  return {
    flex: 1, padding: '10px 0', borderRadius: 100, fontWeight: 700, fontSize: 13.5,
    border: active ? 'none' : '1.5px solid var(--line)',
    background: active ? 'var(--ink)' : '#fff',
    color: active ? '#fff' : 'var(--ink)',
  }
}

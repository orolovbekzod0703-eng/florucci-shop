import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

const EMPTY_FORM = { id: null, name: '', price: '', old_price: '', category: '', tag: '', image_url: '', in_stock: true }

function slugify(label) {
  const map = { "o'": 'o', "g'": 'g', ş: 's', ç: 'c' }
  let s = label.toLowerCase()
  Object.entries(map).forEach(([k, v]) => { s = s.split(k).join(v) })
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return s || `kat-${Date.now()}`
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ background: 'var(--ink)', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 20, color: '#fff' }}>Florucci · Admin</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <button onClick={() => setTab('products')} style={tabBtn(tab === 'products')}>Mahsulotlar</button>
          <button onClick={() => setTab('orders')} style={tabBtn(tab === 'orders')}>Buyurtmalar</button>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 100, fontSize: 13 }}>
            Chiqish
          </button>
        </div>
      </div>
      <div className="wrap" style={{ padding: '40px 32px' }}>
        {tab === 'products' ? <ProductsPanel /> : <OrdersPanel />}
      </div>
    </div>
  )
}

function tabBtn(active) {
  return {
    background: active ? '#fff' : 'none',
    color: active ? 'var(--ink)' : '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 100,
    fontWeight: 700,
    fontSize: 13.5,
  }
}

function ProductsPanel() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)

  async function load() {
    setLoading(true)
    const [{ data, error }, { data: catData }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('created_at', { ascending: true }),
    ])
    if (error) setError(error.message)
    else setProducts(data || [])
    setCategories(catData || [])
    setForm(f => (f.category ? f : { ...f, category: catData?.[0]?.slug || '' }))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addCategory() {
    if (!newCategory.trim()) return
    setAddingCategory(true)
    setError('')
    const slug = slugify(newCategory.trim())
    const { data, error } = await supabase.from('categories').insert({ label: newCategory.trim(), slug }).select().single()
    setAddingCategory(false)
    if (error) { setError(error.message); return }
    setCategories(prev => [...prev, data])
    setForm(f => ({ ...f, category: data.slug }))
    setNewCategory('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      category: form.category,
      tag: form.tag || null,
      image_url: form.image_url || null,
      in_stock: form.in_stock,
    }
    let err
    if (form.id) {
      ;({ error: err } = await supabase.from('products').update(payload).eq('id', form.id))
    } else {
      ;({ error: err } = await supabase.from('products').insert(payload))
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    setForm(EMPTY_FORM)
    load()
  }

  function editProduct(p) {
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      old_price: p.old_price || '',
      category: p.category || (categories[0]?.slug || ''),
      tag: p.tag || '',
      image_url: p.image_url || '',
      in_stock: p.in_stock !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const { error: uploadErr } = await supabase.storage.from('product-images').upload(path, file)
    if (uploadErr) {
      setError('Rasm yuklashda xatolik: ' + uploadErr.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setForm(f => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }

  async function deleteProduct(id) {
    if (!confirm("Mahsulotni o'chirmoqchimisiz?")) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32, alignItems: 'flex-start' }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, position: 'sticky', top: 20 }}>
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>{form.id ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}</h3>
        <div className="field">
          <label>Nomi</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Narxi (so'm)</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div className="field">
          <label>Eski narx (chegirma uchun, ixtiyoriy)</label>
          <input type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: e.target.value })} />
        </div>
        <div className="field">
          <label>Kategoriya</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.label}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Yangi kategoriya nomi"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn-outline" onClick={addCategory} disabled={addingCategory} style={{ padding: '9px 16px', fontSize: 13 }}>
              {addingCategory ? '...' : "Qo'shish"}
            </button>
          </div>
        </div>
        <div className="field">
          <label>Belgi</label>
          <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
            <option value="">Yo'q</option>
            <option value="new">YANGI</option>
            <option value="sale">CHEGIRMA</option>
          </select>
        </div>
        <div className="field">
          <label>Mahsulot rasmi</label>
          {form.image_url && (
            <div style={{ marginBottom: 10, width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
          {uploading && <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6 }}>Yuklanmoqda...</p>}
          <input
            style={{ marginTop: 8 }}
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
            placeholder="yoki rasm havolasini (URL) qo'lda kiriting"
          />
        </div>
        <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="in_stock" style={{ width: 'auto' }} checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
          <label htmlFor="in_stock" style={{ margin: 0 }}>Mavjud (sotuvda)</label>
        </div>
        {error && <p style={{ color: 'var(--coral)', fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" type="submit" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            {saving ? 'Saqlanmoqda...' : form.id ? 'Saqlash' : "Qo'shish"}
          </button>
          {form.id && (
            <button type="button" className="btn-outline" onClick={() => setForm(EMPTY_FORM)}>Bekor qilish</button>
          )}
        </div>
      </form>

      <div>
        {loading ? <p>Yuklanmoqda...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(p => (
              <div key={p.id} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--cream-2)', flex: 'none', overflow: 'hidden' }}>
                  {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                    {categories.find(c => c.slug === p.category)?.label || p.category} · {Number(p.price).toLocaleString('uz-UZ')} so'm
                    {p.in_stock === false && ' · Tugagan'}
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => editProduct(p)}>Tahrirlash</button>
                <button className="btn-ghost" style={{ color: 'var(--coral)' }} onClick={() => deleteProduct(p.id)}>O'chirish</button>
              </div>
            ))}
            {products.length === 0 && <p style={{ color: 'var(--ink-soft)' }}>Hozircha mahsulot yo'q.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

function OrdersPanel() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function toggleExpand(orderId) {
    if (expanded === orderId) { setExpanded(null); return }
    setExpanded(orderId)
    if (!items[orderId]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId)
      setItems(prev => ({ ...prev, [orderId]: data || [] }))
    }
  }

  async function updateStatus(orderId, status) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  if (loading) return <p>Yuklanmoqda...</p>
  if (orders.length === 0) return <p style={{ color: 'var(--ink-soft)' }}>Hozircha buyurtma yo'q.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {orders.map(o => (
        <div key={o.id} className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand(o.id)}>
            <div>
              <div style={{ fontWeight: 700 }}>{o.customer_name} · {o.phone}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                {new Date(o.created_at).toLocaleString('uz-UZ')} · {Number(o.total).toLocaleString('uz-UZ')} so'm
              </div>
            </div>
            <select value={o.status} onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value) }} onClick={e => e.stopPropagation()} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <option value="yangi">Yangi</option>
              <option value="tayyorlanmoqda">Tayyorlanmoqda</option>
              <option value="yuborildi">Yuborildi</option>
              <option value="yetkazildi">Yetkazildi</option>
              <option value="bekor qilindi">Bekor qilindi</option>
            </select>
          </div>
          {expanded === o.id && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              {o.address && <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 10 }}>Manzil: {o.address}</p>}
              {(items[o.id] || []).map(it => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '4px 0' }}>
                  <span>{it.product_name} × {it.qty}</span>
                  <span>{Number(it.price * it.qty).toLocaleString('uz-UZ')} so'm</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

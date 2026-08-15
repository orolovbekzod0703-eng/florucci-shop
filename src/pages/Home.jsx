import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

const CATEGORIES = [
  { label: "O'yinchoq va kitob", value: 'toys' },
  { label: 'Qizlar kiyimi', value: 'girls' },
  { label: "O'g'il bolalar", value: 'boys' },
  { label: 'Bolalar xonasi', value: 'nursery' },
  { label: "Sovg'alar", value: 'gifts' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div id="top">
      <section style={{ background: 'var(--cream-2)', padding: '70px 0 60px' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Har kun bir bayramga aylansin</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, marginBottom: 18, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Kichkina his-tuyg'ular, <em style={{ color: 'var(--coral)', fontStyle: 'italic' }}>rang-barang</em> xotiralar
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: 460, margin: '0 auto 26px', fontSize: 16, lineHeight: 1.6 }}>
            Farzandingiz uchun quvnoq ranglar, yumshoq matolar va sifatli tikuv.
          </p>
          <a href="#catalog" className="btn-primary">Kolleksiyani ko'rish →</a>
        </div>
      </section>

      <section id="catalog" className="wrap" style={{ padding: '60px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: 10 }}>Katalog</div>
          <h2 style={{ fontSize: 32 }}>Barcha mahsulotlar</h2>
        </div>

        {loading && <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Yuklanmoqda...</p>}
        {error && <p style={{ textAlign: 'center', color: 'var(--coral)' }}>Xatolik: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
            Hozircha mahsulot yo'q. Admin panel orqali qo'shishingiz mumkin.
          </p>
        )}

        {CATEGORIES.map(cat => {
          const catProducts = products.filter(p => p.category === cat.value)
          if (catProducts.length === 0) return null
          return (
            <div key={cat.value} id={`cat-${cat.value}`} style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 20, marginBottom: 18 }}>{cat.label}</h3>
              <div style={gridStyle}>
                {catProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )
        })}

        {!loading && products.some(p => !p.category) && (
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 20, marginBottom: 18 }}>Boshqa mahsulotlar</h3>
            <div style={gridStyle}>
              {products.filter(p => !p.category).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }

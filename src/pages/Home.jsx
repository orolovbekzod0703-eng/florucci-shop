import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: productsData, error: productsErr }, { data: categoriesData }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
      ])
      if (productsErr) setError(productsErr.message)
      else setProducts(productsData || [])
      setCategories(categoriesData || [])
      setLoading(false)
    }
    load()
  }, [])

  const visibleProducts = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products

  const searching = query.trim().length > 0

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
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: 10 }}>Katalog</div>
          <h2 style={{ fontSize: 32 }}>Barcha mahsulotlar</h2>
        </div>

        <div style={{ maxWidth: 420, margin: '0 auto 40px', position: 'relative' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Mahsulot qidirish..."
            style={{ width: '100%', padding: '13px 16px 13px 42px', borderRadius: 100, border: '1.5px solid var(--line)', fontSize: 14.5, background: '#fff' }}
          />
        </div>

        {loading && <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Yuklanmoqda...</p>}
        {error && <p style={{ textAlign: 'center', color: 'var(--coral)' }}>Xatolik: {error}</p>}

        {!loading && !error && (
          <>
            {categories.map(cat => {
              const catProducts = visibleProducts.filter(p => p.category === cat.slug)
              if (searching && catProducts.length === 0) return null
              return (
                <div key={cat.id} id={`cat-${cat.slug}`} style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 18 }}>{cat.label}</h3>
                  {catProducts.length === 0 ? (
                    <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Bu bo'limga hali mahsulot qo'shilmagan.</p>
                  ) : (
                    <div style={gridStyle}>
                      {catProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  )}
                </div>
              )
            })}

            {visibleProducts.some(p => !p.category) && (
              <div style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 20, marginBottom: 18 }}>Boshqa mahsulotlar</h3>
                <div style={gridStyle}>
                  {visibleProducts.filter(p => !p.category).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

            {searching && visibleProducts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>"{query}" bo'yicha hech narsa topilmadi.</p>
            )}
          </>
        )}
      </section>
    </div>
  )
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }

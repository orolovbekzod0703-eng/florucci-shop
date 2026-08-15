import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category') || null

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

  function selectCategory(slug) {
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  const searchFiltered = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products

  const visibleProducts = selectedCategory
    ? searchFiltered.filter(p => p.category === selectedCategory)
    : searchFiltered

  const searching = query.trim().length > 0
  const activeCategoryLabel = categories.find(c => c.slug === selectedCategory)?.label

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
          <h2 style={{ fontSize: 32 }}>{activeCategoryLabel || 'Barcha mahsulotlar'}</h2>
        </div>

        <div style={{ maxWidth: 420, margin: '0 auto 24px', position: 'relative' }}>
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

        <div style={pillRowStyle}>
          <button onClick={() => selectCategory(null)} style={pillStyle(!selectedCategory)}>Hamma mahsulotlar</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => selectCategory(c.slug)} style={pillStyle(selectedCategory === c.slug)}>{c.label}</button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>Yuklanmoqda...</p>}
        {error && <p style={{ textAlign: 'center', color: 'var(--coral)' }}>Xatolik: {error}</p>}

        {!loading && !error && (
          visibleProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
              {searching
                ? `"${query}" bo'yicha hech narsa topilmadi.`
                : "Bu bo'limga hali mahsulot qo'shilmagan."}
            </p>
          ) : (
            <div style={gridStyle}>
              {visibleProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )
        )}
      </section>
    </div>
  )
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }
const pillRowStyle = { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 36 }
function pillStyle(active) {
  return {
    padding: '9px 18px',
    borderRadius: 100,
    fontSize: 13.5,
    fontWeight: 700,
    border: active ? 'none' : '1.5px solid var(--line)',
    background: active ? 'var(--coral)' : '#fff',
    color: active ? '#fff' : 'var(--ink)',
  }
}

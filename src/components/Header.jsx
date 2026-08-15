import { useState, useEffect } from 'react'
import { useCart } from '../lib/CartContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function Header() {
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    supabase.from('categories').select('*').order('created_at', { ascending: true }).then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  return (
    <>
      <div style={topbarStyle}>
        <div className="wrap" style={topbarWrap}>
          <span>🚚 500 000 so'mdan yuqori buyurtmalarga bepul yetkazish</span>
          <span>🔄 30 kunlik oson qaytarish</span>
          <span>💛 Har bir buyum sevgi bilan tanlangan</span>
        </div>
      </div>
      <header style={headerStyle}>
        <div className="wrap" style={navStyle}>
          <a href="#top" style={logoStyle}>
            <svg width="40" height="30" viewBox="0 0 60 46" fill="none">
              <path d="M6 44C6 26 18 12 30 12C42 12 54 26 54 44" stroke="#E1573C" strokeWidth="6" strokeLinecap="round"/>
              <path d="M12 44C12 29 20 18 30 18C40 18 48 29 48 44" stroke="#8E9B5C" strokeWidth="6" strokeLinecap="round"/>
              <path d="M18 44C18 32 23 24 30 24C37 24 42 32 42 44" stroke="#E5A430" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 24, color: 'var(--coral)', lineHeight: 1 }}>Florucci</div>
              <div style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--olive)', fontWeight: 700, marginTop: 2 }}>BABY BOUTIQUE</div>
            </div>
          </a>
          <nav style={linksStyle} className="nav-links-desktop">
            {categories.map(c => (
              <a key={c.id} href={`#cat-${c.slug}`} style={{ fontWeight: 700, fontSize: 14.5 }}>{c.label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <a href="https://www.instagram.com/florucci_uzz" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33261F" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
            </a>
            <button onClick={() => setOpen(true)} style={cartBtnStyle} aria-label="Savat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33261F" strokeWidth="1.8"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l1 3"/></svg>
              {count > 0 && <span style={dotStyle}>{count}</span>}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} style={mobileBtnStyle} aria-label="Menyu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33261F" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav style={mobileNavStyle}>
            {categories.map(c => (
              <a key={c.id} href={`#cat-${c.slug}`} onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, fontSize: 15, padding: '10px 0' }}>{c.label}</a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}

const topbarStyle = { background: 'var(--ink)', color: 'var(--cream-2)', fontSize: 12.5 }
const topbarWrap = { display: 'flex', justifyContent: 'center', gap: 30, padding: '8px 32px', flexWrap: 'wrap' }
const headerStyle = { background: 'var(--cream)', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 50 }
const navStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }
const logoStyle = { display: 'flex', alignItems: 'center', gap: 10 }
const linksStyle = { display: 'flex', gap: 28 }
const cartBtnStyle = { position: 'relative', background: 'none', border: 'none' }
const dotStyle = { position: 'absolute', top: -8, right: -9, background: 'var(--coral)', color: '#fff', fontSize: 10, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const mobileBtnStyle = { background: 'none', border: 'none', display: 'none' }
const mobileNavStyle = { display: 'flex', flexDirection: 'column', padding: '4px 32px 18px', borderTop: '1px solid var(--line)' }

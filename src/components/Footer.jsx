export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: '#D9CFC3', paddingTop: 60, marginTop: 40 }}>
      <div className="wrap">
        <div style={gridStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <svg width="30" height="23" viewBox="0 0 60 46" fill="none">
                <path d="M6 44C6 26 18 12 30 12C42 12 54 26 54 44" stroke="#E1573C" strokeWidth="6" strokeLinecap="round"/>
                <path d="M12 44C12 29 20 18 30 18C40 18 48 29 48 44" stroke="#8E9B5C" strokeWidth="6" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 20, color: '#fff' }}>Florucci</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 260, color: '#B8ADA0' }}>
              Farzandingiz uchun rang-barang, yumshoq va sifatli kiyimlar.
            </p>
          </div>
          <div>
            <h5 style={h5Style}>Bog'lanish</h5>
            <ul style={ulStyle}>
              <li><a href="tel:+998947774468">+998 94 777 44 68</a></li>
              <li><a href="https://www.instagram.com/florucci_uzz" target="_blank" rel="noopener noreferrer">@florucci_uzz</a></li>
              <li><a href="https://t.me/florucci_uz" target="_blank" rel="noopener noreferrer">t.me/florucci_uz</a></li>
            </ul>
          </div>
        </div>
        <div style={{ padding: '22px 0 30px', fontSize: 12.5, color: '#8B7F72', textAlign: 'center' }}>
          © {new Date().getFullYear()} Florucci Baby Boutique. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  )
}

const gridStyle = { display: 'flex', flexWrap: 'wrap', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)' }
const h5Style = { color: '#fff', fontSize: 13, letterSpacing: '.06em', marginBottom: 16, textTransform: 'uppercase' }
const ulStyle = { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, padding: 0 }

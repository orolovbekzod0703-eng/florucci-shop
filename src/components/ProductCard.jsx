import { useCart } from '../lib/CartContext.jsx'

const CAT_COLORS = ['var(--pink)', 'var(--mustard)', 'var(--olive)', 'var(--coral)', 'var(--cream-2)']

function colorFor(id) {
  let hash = 0
  for (let i = 0; i < String(id).length; i++) hash = String(id).charCodeAt(i) + ((hash << 5) - hash)
  return CAT_COLORS[Math.abs(hash) % CAT_COLORS.length]
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const bg = colorFor(product.id)

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '1', background: bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {product.tag === 'new' && <span className="badge badge-new" style={tagStyle}>YANGI</span>}
        {product.tag === 'sale' && <span className="badge badge-sale" style={tagStyle}>CHEGIRMA</span>}
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg viewBox="0 0 100 100" width="58%" height="58%" fill="#fff" opacity="0.85">
            <circle cx="50" cy="50" r="30" />
          </svg>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: product.tag === 'sale' ? 'var(--coral)' : 'var(--ink)' }}>
            {Number(product.price).toLocaleString('uz-UZ')} so'm
          </span>
          {product.old_price && (
            <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', textDecoration: 'line-through' }}>
              {Number(product.old_price).toLocaleString('uz-UZ')}
            </span>
          )}
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: 'auto', justifyContent: 'center', fontSize: 13, padding: '11px 16px' }}
          onClick={() => addItem(product)}
          disabled={product.in_stock === false}
        >
          {product.in_stock === false ? 'Tugagan' : "Savatga qo'shish"}
        </button>
      </div>
    </div>
  )
}

const tagStyle = { position: 'absolute', top: 12, left: 12 }

import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // {id, name, price, qty, image_url}
  const [open, setOpen] = useState(false)

  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image_url: product.image_url, qty: 1 }]
    })
    setOpen(true)
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function setQty(id, qty) {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clear, total, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

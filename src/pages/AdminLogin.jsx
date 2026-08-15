import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError("Login yoki parol noto'g'ri")
      return
    }
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream-2)' }}>
      <form onSubmit={handleLogin} className="card" style={{ padding: 36, width: 380, maxWidth: '90vw' }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 24, color: 'var(--coral)', marginBottom: 4 }}>Florucci</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 24 }}>Admin panelga kirish</p>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Parol</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'var(--coral)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  )
}

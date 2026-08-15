import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('checking') // checking | ok | denied

  useEffect(() => {
    async function checkAdmin(session) {
      if (!session) {
        setStatus('denied')
        return
      }
      // Session bor, lekin admin_users jadvalida ro'yxatdan o'tganini tekshiramiz.
      // Oddiy login qilgan (lekin admin ro'yxatida yo'q) foydalanuvchi bu yerda rad etiladi.
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error || !data) {
        await supabase.auth.signOut()
        setStatus('denied')
        return
      }
      setStatus('ok')
    }

    supabase.auth.getSession().then(({ data }) => checkAdmin(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdmin(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (status === 'checking') return null
  if (status === 'denied') return <Navigate to="/admin/login" replace />
  return children
}

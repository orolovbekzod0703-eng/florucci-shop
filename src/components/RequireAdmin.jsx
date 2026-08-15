import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('checking') // checking | ok | denied

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'ok' : 'denied')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'ok' : 'denied')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (status === 'checking') return null
  if (status === 'denied') return <Navigate to="/admin/login" replace />
  return children
}

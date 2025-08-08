import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import Auth from '../components/account/Auth'
import Account from '../components/account/Account'


export default function AccountPage() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lighterGrey to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
      </div>
    </div>
  )
}
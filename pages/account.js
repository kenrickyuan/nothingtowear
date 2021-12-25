import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
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
    <div className="" >
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}
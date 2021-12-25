import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/account/Auth'
import Sneakers from '../components/Sneakers'

export default function SneakersPage() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="">
      {!session ? <Auth /> : <Sneakers session={session} />}
    </div>
  )
}
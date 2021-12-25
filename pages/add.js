import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

import AddSneaker from '../components/page/AddSneaker'

export default function AddSneakerPage() {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [triedToLogin, setTriedToLogin] = useState(false)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    setTriedToLogin(true)
  }, [])

  useEffect(() => {
    if (triedToLogin && !session) {
      router.push("/account")
    }
  }, [session, router, triedToLogin])


  return (
    <div className="">
      {session && <AddSneaker key={session.user.id} session={session} />}
    </div>
  )
}
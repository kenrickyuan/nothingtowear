import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import { useRouter } from 'next/router'
import AddSneaker from '../components/pages/add/index'


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
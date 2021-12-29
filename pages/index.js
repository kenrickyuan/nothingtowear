import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import { useRouter } from 'next/router'
import Sneakers from '../components/page/Sneakers'


export default function Index() {
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
      {session && <Sneakers key={session.user.id} session={session} />}
    </div>
  )
}
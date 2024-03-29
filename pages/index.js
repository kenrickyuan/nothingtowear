import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import { useRouter } from 'next/router'
import Sneakers from '../components/pages/sneakers/index'
import Reset from '../components/account/Reset'

export default function Index() {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [isRecovery, setIsRecovery] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [triedToLogin, setTriedToLogin] = useState(false)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    setTriedToLogin(true)
  }, [])

  useEffect(() => {
    if (router.asPath?.includes("type=recovery")) {
      const { token } = router.query
      setIsRecovery(true)
      setAccessToken(token)
    } else if (triedToLogin && !session) {
      router.push("/account")
    }
  }, [session, router, triedToLogin])


  return (
    <div className="">
      {isRecovery ? <Reset session={session} accessToken={accessToken} /> : session ? <Sneakers key={session.user.id} session={session} /> : null}
    </div>
  )
}
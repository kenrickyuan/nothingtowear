import { useState, useEffect } from 'react'
import { supabase } from '../utils'
import Auth from '../components/account/Auth'
import Account from '../components/account/Account'
import { useRouter } from 'next/router'


export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    console.log(router.query)
    // const query = new URLSearchParams(hash.substring(1));
    // const isRecovery = query.get('type') === 'recovery';

    // if (isRecovery) {
    //   setRecoveryToken(query.get('access_token') ?? null);
    // }
    // if (triedToLogin && !session) {
    //   router.push("/reset")
    // }
  }, [session, router])

  return (
    <div className="" >
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}
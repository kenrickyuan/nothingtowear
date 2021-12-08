import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { tryCatch } from '../utils/tryCatch'

const getUserSneakers = async () => {
  const user = supabase.auth.user()
  const [{ data: sneakerIds, error: ogError, status }, error] = await tryCatch(supabase
    .from('sneakers')
    .select(`
      sneaker_model_id,
      sneaker_models (
        id,
        name,
        thumbnail_url
      )
    `)
    .eq('profile_id', user.id))
  console.log(sneakerIds)
  // try {
  //   let { data: sneakers, error, status } = await supabase
  //     .from('sneakers')
  //     .select('profile_id,sneaker_model_id')
  //     .eq('profile_id', user.id)

  //   if (error && status !== 406) {
  //     throw error
  //   }

  //   if (sneakers) {
  //     console.log(sneakers)
  //   }
  // } catch (error) {
  //   alert(error.message)
  // } finally {
  //   // setLoading(false)
  // }
}

export default function Home({ session }) {
  useEffect(() => {
    console.log('inside useEffect')
    getUserSneakers()
  }, [session])
  
  return (
    <>
      <div>HOMEPAGE!</div>
    </>
  )
}
import { useState, useEffect } from 'react'
import { supabase } from "../../utils/supabaseClient"
import Image from 'next/image'

export default function Sneakers({ session }) {
  const [userSneakers, setUserSneakers] = useState([])
  const getUserSneakers = async () => {
    let { data: userSneakersData, error } = await supabase
      .from('user_sneakers')
      .select(`
      sneaker_model_id,
      sneaker_models (
        id,
        name,
        thumbnail_url,
        colourway,
        sneaker_silhouettes (
          name,
          brands (
            name
          )
        )
      )`)
    if (error) {
      console.error(error.message)
    }
    userSneakersData = await Promise.all(userSneakersData.map(async sneaker => {
      const { data: publicThumbnailUrlData, error } = await supabase.storage.from('thumbnail-images').getPublicUrl(sneaker.sneaker_models.thumbnail_url)
      if (error) {
        throw error
      }
      const publicThumbnailUrl = publicThumbnailUrlData.publicURL
      return {...sneaker, publicThumbnailUrl}
    }))
    setUserSneakers(userSneakersData)
    console.log(userSneakersData)
  }

  useEffect(() => {
    getUserSneakers()
  }, [session])
  

  return (
    <div className="">
      {userSneakers.length === 0 ? <h1>No user sneakers yet</h1> : (
        userSneakers.map(sneaker => {
          return (
            <div key={sneaker.sneaker_models.id}>
              <h3>{sneaker.sneaker_models.name}</h3>
              <div className="w-full h-44 relative">
                <Image src={sneaker.publicThumbnailUrl} layout="fill" objectFit="contain" alt={sneaker.sneaker_models.name} />
              </div>
            </div>
          )
        })
      )}

    </div>
  )
}

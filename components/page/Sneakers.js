import { useState, useEffect } from 'react'
import { supabase } from "../../utils/supabaseClient"
import Image from 'next/image'

export default function Sneakers({ session }) {
  const [userSneakers, setUserSneakers] = useState([])
  const [isSneakerViewGrid, setIsSneakerViewGrid] = useState(true)
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

  useEffect(() => {
    console.log(isSneakerViewGrid)
  }, [isSneakerViewGrid])
  

  return (
    <div className="">
      <header className='fixed flex justify-between items-center z-10 top-4 left-4 right-4 bg-lighterGrey rounded-xl p-2'>
        <h1 className='text-2xl font-semibold'>{userSneakers.length}</h1>
        <button type="button" className='w-10 h-10' onClick={() => setIsSneakerViewGrid(isSneakerViewGrid => !isSneakerViewGrid)}>
          {isSneakerViewGrid ? (
            <Image src="/grid-view.svg" alt="grid-view" width={40} height={40}/>
          ) : (
            <Image src="/list-view.svg" alt="list-view" width={40} height={40}/>
          )}
        </button>
      </header>
      {userSneakers.length === 0 ? <h1>No user sneakers yet</h1> : (
        <ul className={`${isSneakerViewGrid ? "grid grid-cols-3 px-4 gap-[1px]" : ""} pt-[calc(40px+3rem)]`}>
          {userSneakers.map(sneaker => {
            const { publicThumbnailUrl, sneaker_model_id: sneakerModelId, sneaker_models: sneakerModel } = sneaker;
            return (
              <li key={sneakerModelId} className={`${isSneakerViewGrid ? "grid-shadow flex justify-center items-center" : "grid grid-cols-[7rem_1fr] p-4 gap-4 border-t border-lightGrey"}`} onClick={() => console.log('clicked')}>
                <div className={`${isSneakerViewGrid ? "h-24 w-[calc(100%-0.75rem)]" : "h-16 w-full"} relative`}>
                  <Image src={publicThumbnailUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={sneakerModel.name} layout="fill" objectFit="contain"/>
                </div>
                <div className={`${isSneakerViewGrid ? "hidden" : ""} flex flex-col justify-center w-[calc(100vw-10rem)]`}>
                  <p className='text-grey text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis capitalize'>{sneakerModel.sneaker_silhouettes.name}</p>
                  <p className='font-semibold'>{sneakerModel.colourway}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

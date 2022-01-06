import { useState, useEffect } from 'react'
import { supabase } from "../../utils/supabaseClient"
import Image from 'next/image'
import { SpinningLoader } from '../ui/spinningLoader'
import Fuse from 'fuse.js'


export default function Sneakers({ session }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [queryResult, setQueryResult] = useState([])

  const [userSneakers, setUserSneakers] = useState(false) // Make a difference between empty array (user has no sneakers) vs page init (show skeleton)
  const [isSneakerViewGrid, setIsSneakerViewGrid] = useState(true)
  const [activeSneaker, setActiveSneaker] = useState({})
  const [showSneakerModal, setShowSneakerModal] = useState(false)
  const getUserSneakers = async () => {
    let { data: userSneakersData, error } = await supabase
      .from('user_sneakers')
      .select(`
        id,
        sneaker_model_id,
        custom_name,
        location,
        wear_in_rain,
        sneaker_models (
          id,
          name,
          thumbnail_url,
          colourway,
          colourway_name,
          sku,
          release_date,
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
    userSneakersData = await Promise.all(userSneakersData.map(async sneaker => {
      const { data: colourData, error } = await supabase
        .from('user_sneaker_user_colour')
        .select(`
          user_colours (
            id,
            hexcode,
            name
          )
        `)
        .eq('user_sneaker_id', sneaker.id)
      if (error) {
        throw error
      }
      return { ...sneaker, colourData}
    }))
    setUserSneakers(userSneakersData)
    console.log(userSneakersData)
  }

  const handleChangeViewClick = () => {
    // window.scrollTo(0, 0)
    setIsSneakerViewGrid(isSneakerViewGrid => !isSneakerViewGrid)
  }

  const handleSneakerClick = sneaker => {
    setActiveSneaker(sneaker)
    setShowSneakerModal(true)
  }

  useEffect(() => {
    const options = {
      includeMatches: true,
      minMatchCharLength: 2,
      // threshold: 0.0,
      keys: [
        "custom_name",
      ]
    };

    const fuse = new Fuse(userSneakers, options);

    setQueryResult(fuse.search(searchQuery))
  }, [searchQuery])
  
  useEffect(() => {
    getUserSneakers()
  }, [session])

  useEffect(() => {
    console.log(isSneakerViewGrid)
  }, [isSneakerViewGrid])
  
  useEffect(() => {
    console.log(activeSneaker)
  }, [activeSneaker])

  return (
    <div className="">
      <header className='fixed flex justify-between items-center z-10 top-4 left-4 right-4 bg-lighterGrey rounded-xl p-2'>
        <h1 className='text-2xl font-semibold'>{userSneakers.length}</h1>
        {/* <input className='grow bg-lighterGrey pl-8' type="text" name="sneakerQuery" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}>
        </input> */}
        <button type="button" className='w-10 h-10' onClick={() => handleChangeViewClick()}>
          {isSneakerViewGrid ? (
            <Image src="/grid-view.svg" alt="grid-view" width={40} height={40}/>
          ) : (
            <Image src="/list-view.svg" alt="list-view" width={40} height={40}/>
          )}
        </button>
      </header>
      {!userSneakers ? (
        // Page is initing
        <div className='flex justify-center items-center mt-[calc(40px+3rem)] h-[calc(100vh-10rem)]'>
          <SpinningLoader big dark />
        </div>
      ) : userSneakers?.length === 0 ? <h1>No user sneakers yet</h1> : (
        <ul className={`${isSneakerViewGrid ? "grid grid-cols-3 px-4 gap-[1px]" : ""} pt-[calc(40px+3rem)]`}>
            {userSneakers.map((sneaker) => {
            const { publicThumbnailUrl, sneaker_model_id: sneakerModelId, sneaker_models: sneakerModel } = sneaker;
            return (
              <li key={sneakerModelId} className={`${isSneakerViewGrid ? "grid-shadow flex justify-center items-center" : "grid grid-cols-[7rem_1fr] p-4 gap-4 border-t border-lightGrey"}`} onClick={() => handleSneakerClick(sneaker)}>
                <div className={`${isSneakerViewGrid ? "h-24 w-[calc(100%-0.75rem)]" : "h-16 w-full"} relative`}>
                  <Image src={publicThumbnailUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={sneakerModel.name} layout="fill" objectFit="contain"/>
                </div>
                <div className={`${isSneakerViewGrid ? "hidden" : ""} flex flex-col justify-center w-[calc(100vw-10rem)]`}>
                  <p className='text-grey text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis capitalize'>{sneakerModel.sneaker_silhouettes.name}</p>
                  <p className='font-semibold'>{sneakerModel.colourway_name}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {/* Sneaker view modal overlay */}
      <div className={`${showSneakerModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onTouchMove={e => e.preventDefault()} onClick={e => {
        e.preventDefault()
        setShowSneakerModal(false)
  

      }}></div>
      {/* Sneaker view modal */}
      <div className={`${showSneakerModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          setShowSneakerModal(false)
    
        }}>
          <Image src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className="w-full h-32 mt-4 relative pointer-events-none">
          <Image src={activeSneaker?.publicThumbnailUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={activeSneaker?.sneaker_models?.name} layout="fill" objectFit="contain" />
        </div>
        <div className='flex flex-col items-center justify-center pb-6 px-4'>
          <h4 className='text-grey text-lg text-center capitalize'>{activeSneaker?.sneaker_models?.sneaker_silhouettes?.name}</h4>
          <h3 className='font-semibold text-xl text-center'>{activeSneaker?.sneaker_models?.colourway_name}</h3>
        </div>
        <div className='h-[calc(100vh-256px)] overflow-y-scroll pb-[82px]'>
          <>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Nickname</p>
              <p className='font-semibold capitalize'>{activeSneaker?.custom_name}</p>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Location Notes</p>
              <p className='font-semibold capitalize'>{activeSneaker?.location || "No location notes"}</p>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Can Wear</p>
              <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={activeSneaker.wear_in_rain} onChange={e => e.preventDefault()} />
                <label className="relative flex items-center gap-2 mt-2 font-semibold overflow-hidden capitalize before:transition-colors before:peer-checked:bg-[#6c7abb] before:bg-[#97dded] before:border-[#72cce3] before:peer-checked:border-[#5e6baa] before:border-2 before:rounded-full before:w-12 before:h-7 after:content-[''] after:transition-transform after:absolute after:h-5 after:w-5 after:rounded-full after:top-1 after:left-1 after:bg-[#fffba9] peer-checked:after:bg-white after:border-[#f6eb71] peer-checked:after:border-[#e7e8ea] after:border-2 peer-checked:after:translate-x-full" htmlFor="wearInRain">
                  {activeSneaker.wear_in_rain ? "Even in the rain" : "Only on sunny days"}
                  <div className={`${activeSneaker.wear_in_rain ? "translate-x-[8px] translate-y-[0px]" : "translate-x-[8px] translate-y-[-20px]"} absolute left-0 transition-transform duration-100 w-[1px] h-2 bg-white`}></div>
                  <div className={`${activeSneaker.wear_in_rain ? "translate-x-[17px] translate-y-[4px]" : "translate-x-[17px] translate-y-[-20px]"} absolute left-0 transition-transform w-[1px] h-2 bg-white`}></div>
                  <div className={`${activeSneaker.wear_in_rain ? "translate-x-[13px] translate-y-[-6px]" : "translate-x-[13px] translate-y-[-20px]"} absolute left-0 transition-transform duration-250 w-[1px] h-2 bg-white`}></div>
                </label>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Colours</p>
              <div className='grid grid-cols-[repeat(8,30px)] justify-between mt-2'>
                {activeSneaker.colourData?.map(({user_colours}) => (
                  <div key={user_colours.id} className='w-[30px] h-[30px] m-auto rounded-full border-[1px] border-lightGrey' style={{ backgroundColor: `#${user_colours.hexcode}` }}></div>
                ))}
              </div>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Brand</p>
              <p className='font-semibold capitalize'>{activeSneaker?.sneaker_models?.sneaker_silhouettes?.brands?.name}</p>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Colourway</p>
              <p className='font-semibold'>{activeSneaker?.sneaker_models?.colourway || "N/A"}</p>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>SKU</p>
              <p className='font-semibold'>{activeSneaker?.sneaker_models?.sku || "N/A"}</p>
            </div>
            <div className='border-t-[1px] border-lightGrey p-4'>
              <p className='text-grey text-xs'>Release Date</p>
              <p className='font-semibold'>{activeSneaker?.sneaker_models?.release_date || "N/A"}</p>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

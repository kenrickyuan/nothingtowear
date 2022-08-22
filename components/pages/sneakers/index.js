import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Fuse from 'fuse.js'
import { supabase } from "../../../utils/supabaseClient"
import { SpinningLoader } from '../../sharedUi/spinningLoader'
import { SneakersGrid } from './ui/sneakersGrid'
import { SneakerViewModal } from './ui/sneakerViewModal'
import { getSneakerColours, getUserColours, getUserBrands, deleteSneaker } from '../../../utils/index'

export default function Sneakers({ session }) {
  const [searchQuery, setSearchQuery] = useState('')

  const [userSneakers, setUserSneakers] = useState(false) // Make a difference between empty array (user has no sneakers) vs page init (show skeleton)
  const [userBrands, setUserBrands] = useState(false) // Make a difference between empty array (user has no brands) vs page init (show skeleton)
  const [userColours, setUserColours] = useState(false) // Make a difference between empty array (user has no colours) vs page init (show skeleton)
  const [filteredSneakers, setFilteredSneakers] = useState([])
  const [isSneakerViewGrid, setIsSneakerViewGrid] = useState(true)
  const [activeSneaker, setActiveSneaker] = useState({})
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [deleteSneakerLoading, setDeleteSneakerLoading] = useState(false)
  const [filterCanWearInRain, setFilterCanWearInRain] = useState(false)
  const [filterSelectedBrands, setFilterSelectedBrands] = useState([])
  const [filterSelectedColourIds, setFilterSelectedColourIds] = useState([])
  const [filterSearchLoading, setFilterSearchLoading] = useState(false)
  const scrollableDetailsRef = useRef(null)

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
      return { ...sneaker, publicThumbnailUrl: publicThumbnailUrlData.publicURL }
    }))
    userSneakersData = await Promise.all(userSneakersData.map(async sneaker => {
      const colourData = await getSneakerColours(sneaker.id)
      return { ...sneaker, colourData }
    }))
    setUserSneakers(userSneakersData.reverse())
    setFilteredSneakers(userSneakersData)
  }

  const handleChangeViewClick = () => {
    setIsSneakerViewGrid(isSneakerViewGrid => !isSneakerViewGrid)
  }

  const handleSetShowDetailsModal = (toggle) => {
    setShowDetailsModal(toggle)
  }

  const handleSneakerClick = sneaker => {
    setActiveSneaker(sneaker)
    setShowDetailsModal(true)
  }

  const handleDeleteSneaker = async () => {
    // close delete prompt modal
    // set loading
    setDeleteSneakerLoading(true)
    await deleteSneaker(activeSneaker.id)
    // set show active sneaker modal false
    setShowDetailsModal(false)
    // refresh allSneakers state
    getUserSneakers()
    // set loading false
    setDeleteSneakerLoading(false)
  }

  const handleFilterBrandToggle = (brand) => {
    filterSelectedBrands.length > 0 && filterSelectedBrands.includes(brand) 
      ? setFilterSelectedBrands(filterSelectedBrands => filterSelectedBrands.filter(selectedBrand => selectedBrand !== brand)) 
      : setFilterSelectedBrands(filterSelectedBrands => [...filterSelectedBrands, brand]);
    }

  const handleFilterColourToggle = (colourId) => {
    filterSelectedColourIds.length > 0 && filterSelectedColourIds.includes(colourId) 
      ? setFilterSelectedColourIds(filterSelectedColourIds => filterSelectedColourIds.filter(selectedColourId => selectedColourId !== colourId))
      : setFilterSelectedColourIds(filterSelectedColourIds => [...filterSelectedColourIds, colourId])
  }

  const handleFiltersClear = () => {
    setSearchQuery("");
    setFilterCanWearInRain(false);
    setFilterSelectedBrands([]);
    setFilterSelectedColourIds([]);
  }

  const areFiltersActive = () => searchQuery !== "" || filterCanWearInRain || filterSelectedBrands.length > 0 || filterSelectedColourIds.length > 0;

  const handleFilterSneakersClick = () => {
    // See which filters are active
    // check if canWearInRain is checked
    // check if any brands are checked
    // check if any colours are checked

    // Set isLoading true
    // Run Fuse with active filters
    // Set isLoading false
    // Close modal
    // render results

    const options = {
      includeMatches: true,
      shouldSort: true,
      useExtendedSearch: true,
      keys: [
        "custom_name",
        "wear_in_rain",
        "sneaker_models.name",
        "sneaker_models.sneaker_silhouettes.brands.name",
        "colourData.user_colours.id"
      ]
    };
    const fuseQueryArray = []

    searchQuery !== "" && fuseQueryArray.push(
      {
        $or: [
          { "custom_name": `'${searchQuery}`}, // includes entire search Query phrase
          { "sneaker_models.name": `'${searchQuery}`}, // includes entire search Query phrase
        ]
      }
    )

    filterCanWearInRain && fuseQueryArray.push({
      "wear_in_rain": "true"
    })

    if (filterSelectedBrands.length > 0) {
      const fuseBrandQueryArray = []
      filterSelectedBrands.forEach(brand => {
        const brandQuery = `="${brand}"`
        fuseBrandQueryArray.push({ "sneaker_models.sneaker_silhouettes.brands.name": brandQuery })
      })
      fuseQueryArray.push(
        {
          $or: fuseBrandQueryArray
        }
      )
    }

    if (filterSelectedColourIds.length > 0) {
      const fuseColourQueryArray = []
      filterSelectedColourIds.forEach(colourId => {
        fuseColourQueryArray.push({ "colourData.user_colours.id": colourId})
      })
      fuseQueryArray.push(
        {
          $or: fuseColourQueryArray
        }
      )
    }
    const fuseQuery = {
      $and: fuseQueryArray
    }

    if (fuseQueryArray.length === 0) {
      setShowFilterModal(false)
      return setFilteredSneakers(userSneakers)
    }
    const fuse = new Fuse(userSneakers, options);
    setFilterSearchLoading(true)
    setFilteredSneakers(fuse.search(fuseQuery).map(match => match.item))
    setFilterSearchLoading(false)
    setShowFilterModal(false)
  }

  useEffect(() => {
    getUserSneakers();
    (async () => {
      const fetchedUserColours = await getUserColours()
      setUserColours(fetchedUserColours.sort((a, b) => (a.name > b.name) ? 1 : -1)) // Sort userColours by name
    })();
  }, [session])
  
  useEffect(() => {
    userSneakers && setUserBrands(getUserBrands(userSneakers))
  }, [userSneakers])

  return (
    <div className="">
      <header className='fixed flex justify-between items-center z-10 top-4 left-4 right-4 bg-lighterGrey rounded-xl p-2'>
        <button type='button' className='w-10 h-10' onClick={() => setShowFilterModal(true)}>
          <Image unoptimized src="/filter.svg" height={40} width={40} alt="Magnifying glass" />
        </button>
        <h1 className='text-2xl font-semibold'>
          {
            !userSneakers ? ""
            : filteredSneakers.length !== userSneakers.length
            ? `${filteredSneakers.length} (${userSneakers.length})`
            : userSneakers.length
          }
        </h1>
        <button type="button" className='w-10 h-10' onClick={() => handleChangeViewClick()}>
          {isSneakerViewGrid ? (
            <Image unoptimized src="/grid-view.svg" alt="grid-view" width={40} height={40} />
          ) : (
            <Image unoptimized src="/list-view.svg" alt="list-view" width={40} height={40} />
          )}
        </button>
      </header>
      {!userSneakers ? (
        // Page is initing
        <div className='flex justify-center items-center mt-[calc(40px+3rem)] h-[calc(100vh-10rem)]'>
          <SpinningLoader big dark />
        </div>
      ) : userSneakers?.length === 0 ? <h1>No user sneakers yet</h1> : (
        <SneakersGrid {... { isSneakerViewGrid, filteredSneakers, handleSneakerClick }} />
      )}
      {/* Filter sneakers modal overlay */}
      <div className={`${showFilterModal ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"} fixed z-[60] inset-0 bg-black transition-opacity duration-[400ms]`} onTouchMove={e => e.preventDefault()} onClick={e => {
        e.preventDefault()
        setShowFilterModal(false)
      }}></div>
      {/* Filter sneakers modal */}
      <div className={`${showFilterModal ? "translate-x-0" : "translate-y-full"} fixed z-[60] top-8 bottom-0 left-0 right-0 bg-white rounded-tl-3xl rounded-tr-3xl transition-transform duration-[400ms]`}>
        <button type="button" className='absolute top-4 right-4 flex justify-center items-center p-2' onClick={e => {
          e.preventDefault()
          setShowFilterModal(false)
          scrollableDetailsRef.current.scrollTop = 0
        }}>
          <Image unoptimized src="/cross.svg" height={20} width={20} alt="Close modal button" />
        </button>
        <div className='pointer-events-none relative flex flex-col items-center justify-center py-5 px-4 border-b-[1px] border-lightGrey '>
          <button className={`pointer-events-auto absolute left-4 text-xl underline ${!areFiltersActive() && 'hidden'}`} onClick={() => handleFiltersClear()}>Clear</button>
          <h2 className='font-semibold text-2xl text-center overflow-hidden text-ellipsis whitespace-nowrap w-[calc(100vw-1rem)]'>Find Sneakers</h2>
        </div>
        <div className='relative flex p-4 gap-4 border-b border-lightGrey'>
          <input className='grow bg-lighterGrey pl-8' type="text" name="searchQuery" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
          <div className='absolute left-6 top-[27px] pointer-events-none flex items-center'>
            <Image unoptimized src="/search.svg" height={20} width={20} alt="Magnifying glass" />
          </div>
          <button type='button' className={`${searchQuery !== "" ? "flex" : "hidden"} absolute items-center right-4 top-4 py-[11px] px-[10px]`}
            onClick={e => {
              e.preventDefault();
              setSearchQuery("");
            }
            }>
            <Image unoptimized src="/cross-cancel.svg" height={20} width={20} alt="Clear search button" />
          </button>
        </div>
        <div className='h-[calc(100vh-256px)] overflow-y-scroll pb-4'>
          <div className='border-b-[1px] border-lightGrey p-4 flex justify-between items-center'>
            <input className="hidden peer" id="wearInRain" type="checkbox" name="wearInRain" checked={filterCanWearInRain} onChange={() => setFilterCanWearInRain(filterCanWearInRain => !filterCanWearInRain)} />
            <p className='font-semibold text-xl'>Can Wear</p>
            <label className="relative flex flex-row-reverse items-center gap-2 font-semibold overflow-hidden capitalize before:transition-colors before:peer-checked:bg-[#6c7abb] before:bg-[#97dded] before:border-[#72cce3] before:peer-checked:border-[#5e6baa] before:border-2 before:rounded-full before:w-12 before:h-7 after:content-[''] after:transition-transform after:absolute after:h-5 after:w-5 after:rounded-full after:top-1 after:right-6 after:bg-[#fffba9] peer-checked:after:bg-white after:border-[#f6eb71] peer-checked:after:border-[#e7e8ea] after:border-2 peer-checked:after:translate-x-full" htmlFor="wearInRain">
              {filterCanWearInRain ? "even in the rain" : "on sunny days"}
              <div className={`${filterCanWearInRain ? "translate-x-[8px] translate-y-[0px]" : "translate-x-[8px] translate-y-[-20px]"} absolute right-12 transition-transform duration-100 w-[1px] h-2 bg-white`}></div>
              <div className={`${filterCanWearInRain ? "translate-x-[17px] translate-y-[4px]" : "translate-x-[17px] translate-y-[-20px]"} absolute right-12 transition-transform w-[1px] h-2 bg-white`}></div>
              <div className={`${filterCanWearInRain ? "translate-x-[13px] translate-y-[-6px]" : "translate-x-[13px] translate-y-[-20px]"} absolute right-12 transition-transform duration-250 w-[1px] h-2 bg-white`}></div>
            </label>
          </div>
          <div className='relative overflow-hidden border-b-[1px] border-lightGrey'>
            <input id="accordionBrands" className='hidden peer' type="checkbox"></input>
            <label htmlFor="accordionBrands" className=''>
              <div className='flex items-center gap-2 p-4'>
                <p className='font-semibold text-xl'>Brands</p>
                {filterSelectedBrands?.length > 0 && (<p className='font-semibold text-lg'>({filterSelectedBrands.length })</p>)}
              </div>
            </label>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black"></span>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black peer-checked:rotate-0 rotate-90 transition-transform duration-150 ease-linear"></span>
            <div className='max-h-0 peer-checked:max-h-screen transition-maxHeight duration-300 ease-in-out'>
              <ul className='flex flex-wrap justify-evenly p-4 pt-0 gap-3'>
                {userBrands && userBrands.map(brand => (
                  <li key={brand} className='flex'>
                    <input id={`checkbox-${brand}`} className='hidden' type="checkbox" onChange={() => handleFilterBrandToggle(brand)}></input>
                    <label htmlFor={`checkbox-${brand}`} className={`py-2 px-4 border-2 border-lightGrey rounded-3xl capitalize ${filterSelectedBrands.length > 0 && filterSelectedBrands.includes(brand) && 'border-black bg-black text-white'}`}>{brand}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='relative overflow-hidden border-b-[1px] border-lightGrey'>
            <input id="accordionColours" className='hidden peer' type="checkbox"></input>
            <label htmlFor="accordionColours" className=''>
              <div className='flex items-center gap-2 p-4'>
                <p className='font-semibold text-xl'>Colours</p>
                {filterSelectedColourIds?.length > 0 && (<p className='font-semibold text-lg'>({filterSelectedColourIds.length})</p>)}
              </div>
            </label>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black"></span>
            <span className="absolute top-7 right-5 w-5 h-[2px] bg-black peer-checked:rotate-0 rotate-90 transition-transform duration-300 ease-in-out"></span>
            <div className='max-h-0 peer-checked:max-h-screen transition-maxHeight duration-300 ease-in-out'>
              <ul className='flex flex-wrap justify-evenly p-4 pt-1 gap-3'>
                {userColours && userColours.map(colour => {
                  const { name, hexcode, id } = colour;
                  return (
                    <li key={id} className='flex'>
                      <input id={`checkbox-${name}`} className='hidden' type="checkbox" onChange={() => handleFilterColourToggle(id)}></input>
                      <label htmlFor={`checkbox-${name}`} className={`flex items-center gap-2 p-2 rounded-3xl border-2 relative ${filterSelectedColourIds.length > 0 && filterSelectedColourIds.includes(id) ? 'border-black' : 'border-lighterGrey'}`}>
                        <span className={`capitalize p-3 rounded-full border-2 border-lighterGrey relative`} style={{ backgroundColor: `#${hexcode}` }}></span>
                        <span className='capitalize' >{name}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <button onClick={() => handleFilterSneakersClick()} className={`${filterSearchLoading && "h-[50px] pointer-events-none"} bg-black flex justify-center items-center text-center text-white absolute left-4 right-4 bottom-4 w-[calc(100%-2rem)] p-4 rounded-[10px] font-semibold text-[18px] leading-[18px]`}>
          {filterSearchLoading ? <SpinningLoader /> : "Find Sneaker"}
        </button>
      </div>
      <SneakerViewModal {... { showDetailsModal, handleSetShowDetailsModal, scrollableDetailsRef, activeSneaker, deleteSneakerLoading }} />
    </div>
  )
}

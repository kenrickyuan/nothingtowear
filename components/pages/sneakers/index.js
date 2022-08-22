import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Fuse from 'fuse.js'
import { supabase } from "../../../utils/supabaseClient"
import { SpinningLoader } from '../../sharedUi/spinningLoader'
import { SneakersGrid } from './ui/sneakersGrid'
import { SneakerViewModal } from './ui/sneakerViewModal'
import { SneakersFilterModal } from './ui/sneakersFilterModal'
import { getSneakerColours, getUserColours, getUserBrands, deleteSneaker } from '../../../utils/index'

export default function Sneakers({ session }) {
  const [searchQuery, setSearchQuery] = useState('')

  const [userSneakers, setUserSneakers] = useState(false) // Make a difference between empty array (user has no sneakers) vs page init (show skeleton)
  const [userBrands, setUserBrands] = useState(false) // Make a difference between empty array (user has no brands) vs page init (show skeleton)
  const [userColours, setUserColours] = useState(false) // Make a difference between empty array (user has no colours) vs page init (show skeleton)
  const [filteredSneakers, setFilteredSneakers] = useState([])
  
  const [isSneakerViewGrid, setIsSneakerViewGrid] = useState(true);
  const handleChangeViewClick = () => {
    setIsSneakerViewGrid(isSneakerViewGrid => !isSneakerViewGrid)
  };
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

  const handleSetShowDetailsModal = (toggle) => {
    setShowDetailsModal(toggle)
  }

  const handleSetShowFilterModal = (toggle) => {
    setShowFilterModal(toggle)
  }

  const handleSetSearchQuery = (query) => {
    setSearchQuery(query)
  }

  const toggleFilterCanWearInRain = () => {
    setFilterCanWearInRain(filterCanWearInRain => !filterCanWearInRain);
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
      window.scrollTo(0, 0)
      return setFilteredSneakers(userSneakers)
    }
    const fuse = new Fuse(userSneakers, options);
    setFilterSearchLoading(true)
    setFilteredSneakers(fuse.search(fuseQuery).map(match => match.item))
    setFilterSearchLoading(false)
    setShowFilterModal(false)
    window.scrollTo(0, 0)
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
      <SneakersFilterModal {... { showFilterModal, handleSetShowFilterModal, scrollableDetailsRef, areFiltersActive, handleFiltersClear, searchQuery, handleSetSearchQuery, filterCanWearInRain, toggleFilterCanWearInRain, userBrands, handleFilterBrandToggle, filterSelectedColourIds, filterSelectedBrands, userColours, handleFilterColourToggle, handleFilterSneakersClick, filterSearchLoading}} />
      <SneakerViewModal {... { showDetailsModal, handleSetShowDetailsModal, scrollableDetailsRef, activeSneaker, handleDeleteSneaker, deleteSneakerLoading }} />
    </div>
  )
}

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { searchSneakers, supabase, addSneakerToDb} from '../../utils';

export default function AddSneaker({ session }) {
  const [sneakerQuery, setSneakerQuery] = useState('')
  const [stockXSneakersList, setStockXSneakersList] = useState([])
  const [sneakerToAddData, setSneakerToAddData] = useState({})
  const [showAddSneakerModal, setShowAddSneakerModal] = useState(false)

  const handleFormSubmit = async e => {
    e.preventDefault()
    const { data: newUserSneakerInDb, error: newUserSneakerInDbError } = await supabase
      .from('user_sneakers')
      .insert([
        { custom_name: sneakerToAddData.customName, location: sneakerToAddData.location, wear_in_rain: sneakerToAddData.wearInRain, profile_id: session.user.id, sneaker_model_id: sneakerToAddData.modelId},
      ])
    if (newUserSneakerInDbError) {
      console.error(newUserSneakerInDbError)
    } else {
      console.log('form submitted')
      console.log(newUserSneakerInDb)
      setShowAddSneakerModal(false)
      setSneakerToAddData({})
    }
  }

  const handleSearchSubmit = async e => {
    e.preventDefault()
    window.scrollTo(0, 0)
    setStockXSneakersList([])
    // setLoading = true
    const result = await searchSneakers(sneakerQuery)
    // setLoading = false
    setStockXSneakersList(result)
  }
  
  return (
    <div className='mt-[46px]'>
      <header className='fixed top-0 left-0 right-0 z-10'>
        <form onSubmit={e => handleSearchSubmit(e)}>
          <input type="text" name="sneakerQuery" value={sneakerQuery} onChange={e => setSneakerQuery(e.target.value)}></input>
        </form>
      </header>

      <form onSubmit={handleFormSubmit} className={`${showAddSneakerModal ? '' : 'hidden' } fixed inset-0 bg-white z-10`}>
        {sneakerToAddData?.savedThumbnailUrl && (
          <div className="w-full h-44 relative">
            <Image src={sneakerToAddData?.savedThumbnailUrl} layout="fill" objectFit="contain" alt={sneakerToAddData?.silhouetteName} />
          </div>
        )}
        <label>
          Name:
          <input type="text" name="name" value={sneakerToAddData.customName} onChange={e => setSneakerToAddData({ ...sneakerToAddData, customName: e.target.value})}/>
        </label>
        <label>
          Location:
          <input type="text" name="location" value={sneakerToAddData.location || ""} onChange={e => setSneakerToAddData({ ...sneakerToAddData, location: e.target.value})}/>
        </label>
        <label>
          Can wear in rain:
          <input type="checkbox" name="wearInRain" checked={sneakerToAddData.wearInRain} onChange={e => setSneakerToAddData({ ...sneakerToAddData, wearInRain: !sneakerToAddData.wearInRain})}/>
        </label>

        <label>
          Brand:
          <input className='capitalize' type="text" name="brand" value={sneakerToAddData.brandName} disabled />
        </label>
        <label>
          Silhouette:
          <input className='capitalize' type="text" name="silhouette" value={sneakerToAddData.silhouetteName} disabled />
        </label>
        <label>
          Colourway:
          <input type="text" name="colourway" value={sneakerToAddData.colourwayName} disabled />
        </label>
        <input type="submit" value="Submit"/>
      </form>
      <div>
        {stockXSneakersList?.map(sneaker => (
          <div key={sneaker._id}>
            <div className="w-full h-44 relative" onClick={() => {
              addSneakerToDb({ sneaker, setSneakerToAddData, setShowAddSneakerModal})
            }}>
              <Image src={sneaker.thumbnail || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={sneaker.shoeName} layout="fill" objectFit="contain"/>
            </div>
            <p>{sneaker.shoeName}</p>
            <p>{sneaker.brand}</p>
            <p>{sneaker.colorway}</p>
            <p>{sneaker.releaseDate}</p>
            <p>{sneaker.silhoutte}</p>
            <p>{sneaker.styleID}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
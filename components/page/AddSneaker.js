import { useState, useEffect } from 'react'
import { supabase } from "../../utils/supabaseClient"
import imageToBase64 from 'image-to-base64/browser';
import { decode } from 'base64-arraybuffer'

import Image from 'next/image'

export default function AddSneaker({ session }) {
  const [sneakerQuery, setSneakerQuery] = useState('')
  const [stockXSneakersList, setStockXSneakersList] = useState([])
  const [sneakerToAddData, setSneakerToAddData] = useState({})
  const [showAddSneakerModal, setShowAddSneakerModal] = useState(false)

  const searchSneakers = async (query) => {
    const response = await fetch(`http://localhost:3000/api/sneaker/name?query=${query}`)
    const data = await response.json()
    console.log(data?.products)
    console.log('hello')
    setStockXSneakersList(data?.products)
  }
  const getUserSneakers = async () => {
    const { data: sneakerIds, error} = await supabase
      .from('user_sneakers')
      .select(`
      sneaker_model_id,
      sneaker_models (
        id,
        name,
        thumbnail_url
      )`)
    if (error) {
      console.error(error.message)
    }
    console.log(sneakerIds)
  }

  // const getAllSneakerModels = async () => {
  //   let { data: sneaker_models, error } = await supabase
  //     .from('sneaker_models')
  //     .select('*')
  //   console.log(sneaker_models)
  // }

  const addSneakerToDatabase = async (sneaker) => {
    let brandId
    let silhouetteId
    let modelId
    let savedThumbnailPath
    console.log({sneaker})
    const brandName = sneaker.brand?.trim().toLowerCase()
    const silhouette = sneaker.silhoutte?.trim().toLowerCase()
    const modelName = sneaker.shoeName
    const sku = sneaker.styleID
    const sneakerColours = sneaker.colorway
    const colourway = sneaker.shoeName.replace(sneaker.silhoutte, "").trim()
    // See if brand exists by checking brand (brand name, lower cased)
    const { data: brandInDb, error: brandInDbError} = await supabase
      .from('brands')
      .select('id')
      .eq('name', brandName)
    if (brandInDbError) {
      return console.error(brandInDbError)
    }
    // if brand not yet in DB, add to brands db
    if (brandInDb.length === 0 && brandName && brandName.length !== 0) {
      console.log('adding brand to db')
      const {data: newBrandInDb, error: newBrandInDbError} = await supabase
        .from('brands')
        .insert([
          { name: brandName },
        ])
      if (newBrandInDbError) {
        return console.error(newBrandInDbError)
      }
      // --> get brand id
      brandId = newBrandInDb[0].id
    } else {
      brandId = brandInDb[0]?.id
      console.log('brand found', brandId)
    }

    // See if sneaker silhouette exists by checking 'silhoutte'
    const { data: silhouetteInDb, error: silhouetteInDbError} = await supabase
      .from('sneaker_silhouettes')
      .select('id')
      .eq('name', silhouette)
    if (silhouetteInDbError) {
      return console.error(silhouetteInDbError)
    }

    if (silhouetteInDb.length === 0) {
      // if silhouette doesn't exist yet, add to sneaker_silhouettes db
      console.log("silhouette doesn't exist yet, adding silhouette to db")
    
      const { data: newSilhouetteInDb, error: newSilhouetteInDbError} = await supabase
        .from('sneaker_silhouettes')
        .insert([
          { name: silhouette, brand_id: brandId},
        ])
      if (newSilhouetteInDbError) {
        console.error(newSilhouetteInDbError)
      }
      console.log({newSilhouetteInDb})
      // --> get silhouette id
      silhouetteId = newSilhouetteInDb[0].id
    } else {
      silhouetteId = silhouetteInDb[0]?.id
      console.log('silhouette found', silhouetteId)
    }
    // See if sneaker model already exists by checking styleId(SKU) and shoeName
    const { data: modelInDb, error: modelInDbError } = await supabase
      .from('sneaker_models')
      .select('id, thumbnail_url')
      .eq('name', modelName)
      .eq('sku', sku)
    if (modelInDbError) {
      return console.error(modelInDbError)
    }

    if (modelInDb.length === 0) {
      // if sneaker model doesn't exist yet, add to sneaker_models db
      console.log("model doesn't exist yet, adding model to db")
      // Download thumbnail image from stockX
      const thumbnailBase64 = await imageToBase64(sneaker.thumbnail).catch(error => { return console.error(error)})
      // Upload to our db
      const { data: thumbnailData, error: thumbnailError } = await supabase
        .storage
        .from('thumbnail-images')
        .upload(`${Date.now()}_${Math.random()}.png`, decode(thumbnailBase64), {
          contentType: 'image/png'
        })
      if (thumbnailError) {
        return console.error(thumbnailError)
      }
      // Save thumbnail url, remove thumbnail-images/ string in the front
      const thumbnailUrl = thumbnailData.Key.replace("thumbnail-images/", "")

      const { data: newModelInDb, error: newModelInDbError } = await supabase
        .from('sneaker_models')
        .insert([
          { name: modelName, sku: sku, sneaker_silhouette_id: silhouetteId, colours: sneakerColours, colourway: colourway, thumbnail_url: thumbnailUrl},
        ])
      if (newModelInDbError) {
        console.error(newModelInDbError)
      }
      console.log({ newModelInDb })
      // --> get model id
      modelId = newModelInDb[0].id
      savedThumbnailPath = newModelInDb[0].thumbnail_url
    } else {
      modelId = modelInDb[0]?.id
      savedThumbnailPath = modelInDb[0].thumbnail_url
      console.log('model found', modelInDb[0])
    }

    // See if sneaker already exists in user's sneaker db
    const { data: existingSneaker, error: existingSneakerError } = await supabase
      .from('user_sneakers')
      .select('id')
      .eq('sneaker_model_id', modelId)
    if (existingSneakerError) {
      return console.error(existingSneakerError)
    }
    if (existingSneaker.length === 0) {
      // if not, add to user's sneaker db
      console.log("sneaker doesn't exist yet")
      // set all states to prefill sneaker modal, open modal for user to input data
      const { data: publicThumbnailUrl, error } = await supabase.storage.from('thumbnail-images').getPublicUrl(savedThumbnailPath)
      if (error) {
        throw error
      }
      const savedThumbnailUrl = publicThumbnailUrl.publicURL

      setSneakerToAddData({ brandId, silhouetteId, modelId, savedThumbnailUrl: savedThumbnailUrl, silhouetteName: silhouette, colourwayName: colourway, brandName, customName: modelName, wearInRain: false})
      setShowAddSneakerModal(true)
    } else {
      // else, tell them it already exists
      console.log("sneaker already exists!")
    }
  }

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

  useEffect(() => {
    // console.log('inside useEffect', session.user.id)
    getUserSneakers()
    // getAllSneakerModels()
  }, [session])

  useEffect(() => {
    console.log({ sneakerToAddData})
  }, [sneakerToAddData])
  
  return (
    <>
      <input type="text" name="sneakerQuery" value={sneakerQuery} onChange={e => setSneakerQuery(e.target.value)}></input>
      <button onClick={() => searchSneakers(sneakerQuery)}>Search Sneaker</button>
      <form onSubmit={handleFormSubmit} className={`${showAddSneakerModal ? '' : 'hidden' } fixed inset-0 bg-white z-10`}>
        {sneakerToAddData?.savedThumbnailUrl && (
          <div className="w-full h-44 relative">
            <Image src={sneakerToAddData?.savedThumbnailUrl} layout="fill" objectFit="contain" />
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
              addSneakerToDatabase(sneaker)
            }}>
              <Image src={sneaker.thumbnail} alt={sneaker.shoeName} layout="fill" objectFit="contain"/>
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
    </>
  )
}
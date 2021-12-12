import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import imageToBase64 from 'image-to-base64/browser';
import { decode } from 'base64-arraybuffer'

import Image from 'next/image'

export default function Home({ session }) {
  const [sneakerQuery, setSneakerQuery] = useState('')
  const [stockXSneakersList, setStockXSneakersList] = useState([])
  const [sneakerToAddData, setSneakerToAddData] = useState({})
  const [showAddSneakerModal, setShowAddSneakerModal] = useState(false)

  const searchSneakers = async (query) => {
    const response = await fetch(`http://localhost:3000/api/sneaker/name?query=${query}`)
    const data = await response.json()
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

  const getAllSneakerModels = async () => {
    let { data: sneaker_models, error } = await supabase
      .from('sneaker_models')
      .select('*')
    console.log(sneaker_models)
  }

  const addSneakerToDatabase = async (sneaker) => {
    let brandId
    let silhouetteId
    let modelId
    console.log({sneaker})
    const brandName = sneaker.brand?.trim().toLowerCase()
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

    const silhouette = sneaker.silhoutte?.trim().toLowerCase()
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
    const modelName = sneaker.shoeName
    const sku = sneaker.styleID
    const colourway = sneaker.colorway
    const { data: modelInDb, error: modelInDbError } = await supabase
      .from('sneaker_models')
      .select('id')
      .eq('name', modelName)
      .eq('sku', sku)
      .eq('colourway', colourway)
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
          { name: modelName, sku: sku, sneaker_silhouette_id: silhouetteId, colourway: colourway, thumbnail_url: thumbnailUrl},
        ])
      if (newModelInDbError) {
        console.error(newModelInDbError)
      }
      console.log({ newModelInDb })
      // --> get model id
      modelId = newModelInDb[0].id
    } else {
      modelId = modelInDb[0]?.id
      console.log('model found', modelId)
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
      setSneakerToAddData({ brandId, silhouetteId, modelId, modelName, })
      setShowAddSneakerModal(true)
    } else {
      // else, tell them it already exists
      console.log("sneaker already exists!")
    }
  }

  useEffect(() => {
    console.log('inside useEffect')
    getUserSneakers()
    getAllSneakerModels()
  }, [session])

  useEffect(() => {
    console.log({ sneakerToAddData})
  }, [sneakerToAddData])
  
  return (
    <>
      <div>HOMEPAGE!</div>
      <input type="text" name="sneakerQuery" value={sneakerQuery} onChange={e => setSneakerQuery(e.target.value)}></input>
      <button onClick={() => searchSneakers(sneakerQuery)}>Search Sneaker</button>
      {/* <form className={`${showAddSneakerModal ? '' : 'hidden' }fixed inset-0 bg-white`}>
        <label>
          Name:
          <input type="text" name="name" value={sneakerToAddData.}/>
        </label>
        <input type="submit" value="Submit" />
      </form> */}
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
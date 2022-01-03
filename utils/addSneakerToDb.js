import imageToBase64 from 'image-to-base64/browser';
import { decode } from 'base64-arraybuffer'
import { supabase } from '.';

export const addSneakerToDb = async ({ sneakerToAddData, setSneakerToAddData, setAddSneakerModalStep}) => {
  let brandId
  let silhouetteId
  let modelId
  let savedThumbnailPath
  const { stockXSneakerData } = sneakerToAddData;
  console.log(stockXSneakerData)
  const brandName = stockXSneakerData.brand?.trim().toLowerCase()
  const silhouette = stockXSneakerData.silhoutte?.trim().toLowerCase()
  const modelName = stockXSneakerData.shoeName
  const sku = stockXSneakerData.styleID
  const releaseDate = stockXSneakerData.releaseDate
  const colourway = stockXSneakerData.colorway
  const colourwayName = stockXSneakerData.shoeName.replace(stockXSneakerData.silhoutte, "").trim()
  // See if brand exists by checking brand (brand name, lower cased)
  const { data: brandInDb, error: brandInDbError } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
  if (brandInDbError) {
    return console.error(brandInDbError)
  }
  // if brand not yet in DB, add to brands db
  if (brandInDb.length === 0 && brandName && brandName.length !== 0) {
    console.log('adding brand to db')
    const { data: newBrandInDb, error: newBrandInDbError } = await supabase
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
  const { data: silhouetteInDb, error: silhouetteInDbError } = await supabase
    .from('sneaker_silhouettes')
    .select('id')
    .eq('name', silhouette)
  if (silhouetteInDbError) {
    return console.error(silhouetteInDbError)
  }

  if (silhouetteInDb.length === 0) {
    // if silhouette doesn't exist yet, add to sneaker_silhouettes db
    console.log("silhouette doesn't exist yet, adding silhouette to db")

    const { data: newSilhouetteInDb, error: newSilhouetteInDbError } = await supabase
      .from('sneaker_silhouettes')
      .insert([
        { name: silhouette, brand_id: brandId },
      ])
    if (newSilhouetteInDbError) {
      console.error(newSilhouetteInDbError)
    }
    console.log({ newSilhouetteInDb })
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
    const thumbnailBase64 = await imageToBase64(stockXSneakerData.thumbnail).catch(error => { return console.error(error) })
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
        { name: modelName, sku: sku, sneaker_silhouette_id: silhouetteId, colourway, colourway_name: colourwayName, thumbnail_url: thumbnailUrl, release_date: releaseDate},
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

    setSneakerToAddData({ stockXSneakerData, brandId, silhouetteId, modelId, savedThumbnailUrl: savedThumbnailUrl, silhouetteName: silhouette, colourwayName, brandName, customName: modelName, wearInRain: false })
    setAddSneakerModalStep("details")
  } else {
    // else, tell them it already exists
    console.log("sneaker already exists!")
    setAddSneakerModalStep("exists")
  }
}
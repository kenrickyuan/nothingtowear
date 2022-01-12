import { supabase } from '.';

export const addUserSneaker = async ({ sneakerToAddData, setAddSneakerModalStep, profileId, openErrorModal }) => {
  // check one more time if the sneaker is already in user's collection
  const { data: existingSneaker, error: existingSneakerError } = await supabase
    .from('user_sneakers')
    .select('id')
    .eq('sneaker_model_id', sneakerToAddData.modelId)
  if (existingSneakerError) {
    openErrorModal("Something went wrong, please try again later or contact Kenrick.")
    return console.error(existingSneakerError)
  }
  if (existingSneaker.length !== 0) {
    console.log("sneaker already exists!")
    setAddSneakerModalStep("exists")
  }
  const { data: newUserSneakerInDb, error: newUserSneakerInDbError } = await supabase
    .from('user_sneakers')
    .insert([
      { custom_name: sneakerToAddData.customName, location: sneakerToAddData.location, wear_in_rain: sneakerToAddData.wearInRain, profile_id: profileId, sneaker_model_id: sneakerToAddData.modelId },
    ])
  if (newUserSneakerInDbError) {
    openErrorModal("Something went wrong, please try again later or contact Kenrick.")
    return console.error(newUserSneakerInDbError)
  }
  const addSneakerColourJoin = async (colour) => {
    const { data: newSneakerColourJoin, error: newSneakerColourJoinError } = await supabase
      .from('user_sneaker_user_colour')
      .insert([
        { user_sneaker_id: newUserSneakerInDb[0].id, user_colour_id: colour.id, profile_id: profileId },
      ])
    if (newSneakerColourJoinError) {
      openErrorModal("Something went wrong, please try again later or contact Kenrick.")
      return console.error(newSneakerColourJoinError)
    }
    return newSneakerColourJoin
  }
  // create user_sneaker_user_colour join table entries
  if (sneakerToAddData.sneakerColours) {
    await Promise.all(sneakerToAddData.sneakerColours.map(addSneakerColourJoin))
  }
}

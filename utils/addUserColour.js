import { supabase } from '.';

export const addUserColour = async ({ newColourHex, setNewColourHex, newColourName, setNewColourName, profileId, openErrorModal, setShowCreateUserColourModal, userColours, setUserColours }) => {
  if (!/^[a-zA-Z\s]*$/.test(newColourName)) {
    return openErrorModal("Colour name cannot contain symbols or numbers")
  }
  // TODO: Clean hex and name of symbols (like fullstop when someone double spacebars)
  const newColourHexCleaned = newColourHex.trim().replace("#", "").toLocaleUpperCase()
  const newColourNameCleaned = newColourName.trim().replace(" ", "_").toLocaleLowerCase()

  // See if sneaker silhouette exists by checking 'silhoutte'
  const { data, error } = await supabase
    .from('user_colours')
    .select('id')
    .or(`name.eq.${newColourNameCleaned},hexcode.eq.${newColourHexCleaned}`)

  if (error) {
    console.error(error)
    return openErrorModal("Something went wrong, please try again later or contact Kenrick.")
  }

  if (data.length !== 0) {
    // if user_colour doesn't exist yet, add to user_colourss db
    return openErrorModal(`You already have a colour with the hexcode:#${newColourHexCleaned} or name:${newColourNameCleaned}`)
  } else {
    const { data: newUserColourData, error: newUserColourError } = await supabase
      .from('user_colours')
      .insert([
        { name: newColourNameCleaned, hexcode: newColourHexCleaned, profile_id: profileId },
      ])
    if (newUserColourError) {
      console.error(newUserColourError)
      return openErrorModal("Something went wrong adding the new colour, please try again later or contact Kenrick.")
    }
    setUserColours([...userColours, { id: newUserColourData[0].id, hexcode: newUserColourData[0].hexcode, name: newUserColourData[0].name}])
    setShowCreateUserColourModal(false)
    setNewColourName("")
    setNewColourHex("#397273")
  }
}

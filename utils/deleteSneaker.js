import { supabase } from '.';

import { getSneakerColours } from '.';

export const deleteSneaker = async (sneakerId) => {
  // get all color-sneaker data, delete them
  const allSneakerColours = await getSneakerColours(sneakerId)
  await Promise.all(allSneakerColours.map(async sneakerColour => {
    const { data: deleteSneakerColourData, error } = await supabase
      .from('user_sneaker_user_colour')
      .delete()
      .eq('id', sneakerColour.id)
    if (error) {
      return console.error(error)
    }
  }))
  // delete sneaker
  const { data, error } = await supabase
    .from('user_sneakers')
    .delete()
    .eq('id', sneakerId)
  if (error) {
    return console.error(error)
  }
}
import { supabase } from '.';

export const getSneakerColours = async (sneakerId) => {
  const { data, error } = await supabase
    .from('user_sneaker_user_colour')
    .select(`
      id,
      user_colours (
        id,
        hexcode,
        name
      )
    `)
    .eq('user_sneaker_id', sneakerId)

  if (error) {
    return console.error(error)
  }

  return data
}

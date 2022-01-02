import { supabase } from '.';

export const addUserColour = async ({hexcode, colourName, profileId}) => {
  const { data, error } = await supabase
    .from('user_colours')
    .insert([
      { name: colourName, profile_id: profileId, hexcode },
    ])
  if (error) {
    return console.error(error)
  }
  console.log(data)
}

import { supabase } from '.';

export const getUserColours = async () => {
  const { data, error } = await supabase
    .from('user_colours')
    .select(`
      name,
      hexcode,
      id
    `)
  if (error) {
    return console.error(error)
  }
  return data
}

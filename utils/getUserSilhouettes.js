import { supabase } from './supabaseClient'

export const getUserSilhouettes = async () => {
  const user = supabase.auth.user()
  
  let { data: userSilhouettesData, error } = await supabase
    .from('user_sneakers')
    .select(`
      sneaker_models (
        sneaker_silhouettes (
          name
        )
      )
    `)
    .eq('profile_id', user.id)

  if (error) {
    console.error(error.message)
    return []
  }

  // Extract unique silhouette names
  const silhouetteNames = userSilhouettesData
    .map(sneaker => sneaker.sneaker_models?.sneaker_silhouettes?.name)
    .filter(name => name) // Remove any null/undefined values
    .filter((name, index, array) => array.indexOf(name) === index) // Remove duplicates
    .sort() // Sort alphabetically

  return silhouetteNames
}
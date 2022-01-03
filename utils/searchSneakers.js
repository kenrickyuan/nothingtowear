export const searchSneakers = async (query) => {
  const response = await fetch(`/api/sneaker/name?query=${query}`)
  const data = await response.json()
  return data?.products
}
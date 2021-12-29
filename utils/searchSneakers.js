export const searchSneakers = async (query) => {
  const response = await fetch(`http://localhost:3000/api/sneaker/name?query=${query}`)
  const data = await response.json()
  return data?.products
}
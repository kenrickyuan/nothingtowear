export const getUserBrands = (userSneakers) => {
  const userBrands = []
  userSneakers.forEach(sneaker => {
    const sneakerBrand = sneaker.sneaker_models.sneaker_silhouettes.brands.name
    !userBrands.includes(sneakerBrand) && userBrands.push(sneakerBrand)
  })
  return userBrands
}

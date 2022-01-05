const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: ['images.stockx.com', 'stockx.imgix.net', 'abdfxnbtxbnznepuhwbg.supabase.co', 'stockx-assets.imgix.net']
  },
  reactStrictMode: true,
})

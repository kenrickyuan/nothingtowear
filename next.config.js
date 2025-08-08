const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: false,
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest.json$/],
  },
  images: {
    domains: ['images.stockx.com', 'stockx.imgix.net', 'abdfxnbtxbnznepuhwbg.supabase.co', 'stockx-assets.imgix.net']
  },
  reactStrictMode: true,
})

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const SneaksAPI = require('sneaks-api');

export default function handler(req, res) {
  const sneaks = new SneaksAPI();
  const { query } = req.query
  sneaks.getProducts(query, 20, function(err, products){
    if (err) {
      res.status(500).json({ err })
    } else {
      res.status(200).json({ products })
    }
  })
}

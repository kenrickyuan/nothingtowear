const SneaksAPI = require('sneaks-api');

export default function handler(req, res) {
  const sneaks = new SneaksAPI();
  const { query } = req.query
  console.log("query", query)
  sneaks.getProductPrices(query, function(err, product){
    if (err) {
      res.status(500).json({ err })
    } else {
      res.status(200).json({ product })
    }
  })
}
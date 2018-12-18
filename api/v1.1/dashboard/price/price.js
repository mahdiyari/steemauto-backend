const fetch = require('node-fetch')
const config = require('../../../../config')

let steemPrice
let sbdPrice

const getPrice = () => {
  return {
    steem_price: steemPrice || 1.0,
    sbd_price: sbdPrice || 1.0
  }
}

const receivePrice = async () => {
  fetch(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=STEEM,SBD&convert=USD',
    {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': config.cmcApiKey
      }
    }
  )
    .then(res => res.json())
    .then(res => {
      steemPrice = res.data.STEEM.quote.USD.price.toFixed(2)
      sbdPrice = res.data.SBD.quote.USD.price.toFixed(2)
    })
}

receivePrice()
setInterval(() => receivePrice(), 900000)

module.exports = getPrice

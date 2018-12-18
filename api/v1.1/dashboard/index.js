const express = require('express')
const router = express.Router()
const getStats = require('./getStats')
const getLimits = require('./limits/getLimits')
const setLimits = require('./limits/setLimits')
const getPrice = require('./price/price')
const getSuccessfulVotes = require('./votes/successful_votes')
const getFailedVotes = require('./votes/failed_votes')

// this method will return required stats for user dashboard
router.post('/:id', async (req, res) => {
  switch (req.params.id) {
    case 'stats': {
      const stats = await getStats()
      res.json(stats)
      break
    }
    case 'get_limits': {
      const limits = await getLimits(req.body.user)
      res.json(limits)
      break
    }
    case 'set_limits': {
      const result = await setLimits(
        req.body.user,
        req.body.type,
        req.body.limit
      )
      res.json(result)
      break
    }
    case 'price': {
      const price = getPrice()
      res.json(price)
      break
    }
    case 'successful_votes': {
      const result = await getSuccessfulVotes(req.body.user)
      res.json(result)
      break
    }
    case 'failed_votes': {
      const result = await getFailedVotes(req.body.user)
      res.json(result)
      break
    }
    default:
      res.json({
        id: 0,
        error: 'bad request'
      })
      break
  }
})

module.exports = router

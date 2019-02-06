const express = require('express')
const router = express.Router()
const getFollowing = require('./getFollowing')
const getTopTrails = require('./getTopTrails')
const searchTrail = require('./searchTrail')

router.post('/:id', async (req, res) => {
  switch (req.params.id) {
    case 'following': {
      const following = await getFollowing(req.body.user)
      res.json(following)
      break
    }
    case 'top_trails': {
      const result = await getTopTrails()
      res.json(result)
      break
    }
    case 'search': {
      const result = await searchTrail(req.body.trail)
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

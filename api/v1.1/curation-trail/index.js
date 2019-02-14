const express = require('express')
const router = express.Router()
const getFollowing = require('./getFollowing')
const getTopTrails = require('./getTopTrails')
const searchTrail = require('./searchTrail')
const toggleTrail = require('./toggleTrail')

router.post('/:id', async (req, res) => {
  switch (req.params.id) {
    case 'all_following': {
      const allFollowing = await getFollowing(req.cookies.username)
      res.json(allFollowing)
      break
    }
    case 'one_following': {
      const oneFollowing = await getFollowing(req.cookies.username, req.body.trail)
      res.json(oneFollowing)
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
    case 'enable': {
      const result = await toggleTrail(req.cookies.username, req.body.trail, 1)
      res.json(result)
      break
    }
    case 'disable': {
      const result = await toggleTrail(req.cookies.username, req.body.trail, 0)
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

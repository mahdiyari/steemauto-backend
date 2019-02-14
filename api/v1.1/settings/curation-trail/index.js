const express = require('express')
const router = express.Router()
const toggleTrailVar = require('./toggleTrailVar')
const weightTrail = require('./weightTrail')
const delayTrail = require('./delayTrail')

router.post('/:id', async (req, res) => {
  switch (req.params.id) {
    case 'enable': {
      const enable = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'enable',
        1
      )
      res.json(enable)
      break
    }
    case 'disable': {
      const disable = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'enable',
        0
      )
      res.json(disable)
      break
    }
    case 'weight': {
      const weight = await weightTrail(
        req.cookies.username,
        req.body.trails,
        req.body.method,
        req.body.weight
      )
      res.json(weight)
      break
    }
    case 'delay': {
      const delay = await delayTrail(
        req.cookies.username,
        req.body.trails,
        req.body.delay
      )
      res.json(delay)
      break
    }
    case 'enableselfvote': {
      const selfvote = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'selfvote',
        1
      )
      res.json(selfvote)
      break
    }
    case 'disableselfvote': {
      const selfvote = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'selfvote',
        0
      )
      res.json(selfvote)
      break
    }
    case 'enablecommentvote': {
      const commentvote = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'commentvote',
        1
      )
      res.json(commentvote)
      break
    }
    case 'disablecommentvote': {
      const commentvote = await toggleTrailVar(
        req.cookies.username,
        req.body.trails,
        'commentvote',
        0
      )
      res.json(commentvote)
      break
    }
    default: {
      res.json({
        id: 0,
        error: 'bad request'
      })
      break
    }
  }
})

module.exports = router

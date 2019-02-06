const express = require('express')
const router = express.Router()
const getInfo = require('./getInfo')

router.post('/:id', async (req, res) => {
  switch (req.params.id) {
    case 'get_info': {
      const result = await getInfo(req.body.trail)
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

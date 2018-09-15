const express = require('express')
const router = express.Router()

// since our cookies are httOnly, we can not remove that cookies in the client side
// we should remove that cookies in the server side
router.post('/', async (req, res) => {
  res.cookie('access_key', '', {httpOnly: true})
  res.cookie('username', '', {httpOnly: true})
  res.json({
    id: 1,
    result: 'success'
  })
})

module.exports = router

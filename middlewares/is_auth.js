const con = require('../helpers/mysql')
const express = require('express')
const router = express.Router()

router.use(async (req, res, next) => {
  if (req && req.cookies && req.cookies.access_key && req.cookies.username) {
    const username = req.cookies.username
    const accessKey = req.cookies.access_key
    const result = await con.query(
      'SELECT `access_key` FROM `users` WHERE `user`=?',
      [username]
    )
    if (result && result[0].access_key === accessKey) {
      next()
    } else {
      res.json({
        id: 0,
        error: 'wrong auth provided'
      })
    }
  } else {
    res.json({
      id: 0,
      error: 'missed auth param'
    })
  }
})

module.exports = router

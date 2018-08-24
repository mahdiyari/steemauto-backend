const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// trail wants to disable/enable trail
router.post('/', async (req, res) => {
  const username = req.cookies.username
  if (username) {
    // First we will make sure this user is a trail
    const trailExists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
      [username]
    )
    if (trailExists) {
      // we will toggle between disable/enable
      const result = await con.query(
        'SELECT `enable` FROM `trailers` WHERE `user`=?',
        [username]
      )
      const enable = result[0].enable
      let changeEnable
      if (enable === 1) {
        changeEnable = 0
      } else {
        changeEnable = 1
      }
      await con.query(
        'UPDATE `trailers` SET `enable`=? WHERE `user`=?',
        [changeEnable, username]
      )
      res.json({
        id: 1,
        result: 'Successfully updated!'
      })
    } else {
      res.json({
        id: 0,
        result: 'you are not a trail!'
      })
    }
  } else {
    res.json({
      id: 0,
      error: 'operation params missed'
    })
  }
})

module.exports = router

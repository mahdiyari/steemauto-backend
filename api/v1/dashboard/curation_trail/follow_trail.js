const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to follow a trail
router.post('/', async (req, res) => {
  const trail = req.body.trail
  const username = req.cookies.username
  console.log(username, trail)
  if (trail && username) {
    // First we will make sure that trail exists in steemauto
    const trailExists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
      [trail]
    )
    if (trailExists) {
      // we will make sure user is not already followed that trail
      const exists = await con.query(
        'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `trailer`=? AND `follower`=?)',
        [trail, username]
      )
      if (!exists) {
        // Follow trail and increase the number of followers
        await con.query(
          'INSERT INTO `followers`(`trailer`,`follower`,`weight`) VALUES (?,?,"5000")',
          [trail, username]
        )
        await con.query(
          'UPDATE `trailers` SET `followers`=`followers`+1 WHERE `user`=?',
          [trail]
        )
        res.json({
          id: 1,
          result: 'Successfully followed with default settings!'
        })
      } else {
        res.json({
          id: 0,
          error: 'Already followed!'
        })
      }
    } else {
      res.json({
        id: 0,
        error: 'trail not found'
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

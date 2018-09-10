const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to follow a fan
router.post('/', async (req, res) => {
  const fan = req.body.fan
  const username = req.cookies.username
  if (fan && username) {
    // First we will make sure that fan exists in steemauto
    let fanExists = await con.query(
      'SELECT EXISTS(SELECT `fan` FROM `fans` WHERE `fan`=?)',
      [fan]
    )
    // MySQL will return result like: [{query: result}]
    // We should select result
    for (let i in fanExists[0]) {
      fanExists = fanExists[0][i]
    }
    if (fanExists) {
      // we will make sure user is already followed that fan
      let exists = await con.query(
        'SELECT EXISTS(SELECT `follower` FROM `fanbase` WHERE `fan`=? AND `follower`=?)',
        [fan, username]
      )
      for (let i in exists[0]) {
        exists = exists[0][i]
      }
      if (exists) {
        // unfollow fan and decrease the number of followers
        await con.query(
          'DELETE FROM `fanbase` WHERE `fan`=? AND `follower`=?',
          [fan, username]
        )
        await con.query(
          'UPDATE `fans` SET `followers`=`followers`-1 WHERE `fan`=?',
          [fan]
        )
        res.json({
          id: 1,
          result: 'Successfully unfollowed!'
        })
      } else {
        res.json({
          id: 0,
          error: 'Already unfollowed!'
        })
      }
    } else {
      // fan is not in the database
      res.json({
        id: 0,
        error: 'fan not found'
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

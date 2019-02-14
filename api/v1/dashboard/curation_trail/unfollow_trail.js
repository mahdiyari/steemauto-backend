const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')
const isAuth = require('../../../../middlewares/is_auth')

// confirm user is authorized
router.use(isAuth)

// user wants to unfollow a trail
router.post('/', async (req, res) => {
  const trail = req.body.trail
  const username = req.cookies.username
  if (trail && username) {
    // First we will make sure that trail exists in steemauto
    let trailExists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
      [trail]
    )
    // MySQL will return result like: [{query: result}]
    // We should select result
    for (let i in trailExists[0]) {
      trailExists = trailExists[0][i]
    }
    if (trailExists) {
      // we will make sure user is following that trail
      let exists = await con.query(
        'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `trailer`=? AND `follower`=?)',
        [trail, username]
      )
      for (let i in exists[0]) {
        exists = exists[0][i]
      }
      if (exists) {
        // Unfollow trail and decrease the number of followers
        await con.query(
          'DELETE FROM `followers` WHERE `trailer`=? AND `follower`=?',
          [trail, username]
        )
        await con.query(
          'UPDATE `trailers` SET `followers`=`followers`-1 WHERE `user`=?',
          [trail]
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

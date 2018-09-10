const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to change settings for a trail
router.post('/', async (req, res) => {
  const trail = req.body.trail
  const weight = req.body.weight
  const minute = req.body.minute
  const enable = req.body.enable
  const votingway = req.body.votingway
  const username = req.cookies.username
  if (trail && username && weight && minute && enable && votingway) {
    // we will apply settings if parameters was in expected format
    const error = await isError(weight, minute, enable, votingway)
    if (!error) {
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
          // Updating database with new valid settings then printing the result
          const weight2 = weight * 100
          await con.query(
            'UPDATE `followers` SET `weight`=?, `aftermin`=?, `votingway`=?, `enable`=?' +
            'WHERE `trailer`=? AND `follower`=?',
            [weight2, minute, votingway, enable, trail, username]
          )
          res.json({
            id: 1,
            result: 'settings successfully updated'
          })
        } else {
          res.json({
            id: 0,
            error: 'you are not following this trail'
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
        error: 'wrong params'
      })
    }
  } else {
    res.json({
      id: 0,
      error: 'required params missed'
    })
  }
})

// this function will return true(1) if there was any wrong parameter
const isError = async (weight, minute, enable, votingway) => {
  if (!isNaN(weight) && !isNaN(minute) && !isNaN(enable) && !isNaN(votingway)) {
    weight = Number(weight)
    minute = Number(minute)
    enable = Number(enable)
    votingway = Number(votingway)
    // minute should be between 0 and 30
    if (minute < 0 || minute > 30) {
      return 1
    }
    // weight should be between 0.01 and 100
    if (weight < 0.01 && weight > 100) {
      return 1
    }
    // enable is 1 or 0
    if (enable !== 1 && enable !== 0) {
      return 1
    }
    // votingway is 1 (scale voting) or 2 (fixed voting)
    if (votingway !== 1 && votingway !== 2) {
      return 1
    }
    // all parameters are in the expected format
    return 0
  } else {
    return 1
  }
}

module.exports = router

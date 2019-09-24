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
  let type = req.body.type
  if (type && (type === 2 || type === '2')) {
    type = 2
  } else {
    type = 1
  }
  if (trail && username && weight && minute && enable && votingway) {
    // we will apply settings if parameters was in expected format
    const error = isError(weight, minute, enable, votingway, type)
    if (!error) {
      // First we will make sure that trail exists in steemauto
      let trailExists = await con.query(
        'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=? AND `type`=?)',
        [trail, type]
      )
      // MySQL will return result like: [{query: result}]
      // We should select result
      for (let i in trailExists[0]) {
        trailExists = trailExists[0][i]
      }
      if (trailExists) {
        // we will make sure user is following that trail
        let exists = await con.query(
          'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `trailer`=? AND `follower`=? AND `type`=?)',
          [trail, username, type]
        )
        for (let i in exists[0]) {
          exists = exists[0][i]
        }
        if (exists) {
          // Updating database with new valid settings then printing the result
          const weight2 = weight * 100
          await con.query(
            'UPDATE `followers` SET `weight`=?, `aftermin`=?, `votingway`=?, `enable`=?' +
              'WHERE `trailer`=? AND `follower`=? AND `type`=?',
            [weight2, minute, votingway, enable, trail, username, type]
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
const isError = (weight, minute, enable, votingway, type) => {
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
    if (type === 1 && (weight < 0.01 || weight > 100)) {
      return 1
    }
    if (type === 2 && (weight < -100 || weight > -0.01)) {
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

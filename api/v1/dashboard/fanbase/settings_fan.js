const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to change settings for a fan
router.post('/', async (req, res) => {
  const fan = req.body.fan
  const weight = req.body.weight
  const minute = req.body.minute
  const enable = req.body.enable
  const dailylimit = req.body.dailylimit
  const username = req.cookies.username
  if (fan && username && weight && minute && enable && dailylimit) {
    // we will apply settings if parameters was in expected format
    const error = isError(weight, minute, enable, dailylimit)
    if (!error) {
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
        // we will make sure user is following that fan
        let exists = await con.query(
          'SELECT EXISTS(SELECT `fan` FROM `fanbase` WHERE `fan`=? AND `follower`=?)',
          [fan, username]
        )
        for (let i in exists[0]) {
          exists = exists[0][i]
        }
        if (exists) {
          // Updating database with new valid settings then printing the result
          const weight2 = weight * 100
          await con.query(
            'UPDATE `fanbase` SET `weight`=?, `aftermin`=?, `dailylimit`=?, `limitleft`=?, `enable`=?' +
            'WHERE `fan`=? AND `follower`=?',
            [weight2, minute, dailylimit, dailylimit, enable, fan, username]
          )
          res.json({
            id: 1,
            result: 'settings successfully updated'
          })
        } else {
          res.json({
            id: 0,
            error: 'you are not following this fan'
          })
        }
      } else {
        res.json({
          id: 0,
          error: 'fan not found'
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
const isError = (weight, minute, enable, dailylimit) => {
  if (!isNaN(weight) && !isNaN(minute) && !isNaN(enable) && !isNaN(dailylimit)) {
    weight = Number(weight)
    minute = Number(minute)
    enable = Number(enable)
    dailylimit = Number(dailylimit)
    // minute should be between 0 and 30
    if (minute < 0 || minute > 30) {
      return 1
    }
    // weight should be between 0.01 and 100
    if (weight < 0.01 || weight > 100) {
      return 1
    }
    // enable is 1 or 0
    if (enable !== 1 && enable !== 0) {
      return 1
    }
    // dailylimit is between 1 and 99
    if (dailylimit < 1 || dailylimit > 99) {
      return 1
    }
    // all parameters are in the expected format
    return 0
  } else {
    return 1
  }
}

module.exports = router

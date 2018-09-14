const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')
const call = require('../../../../helpers/nodeCall')
const config = require('../../../../config')

// user wants to upvote comments of a user
router.post('/', async (req, res) => {
  const username = req.cookies.username
  const userToAdd = req.body.user
  const weight = req.body.weight
  const minute = req.body.minute
  if (username && userToAdd && minute && weight) {
    // we should make sure received parameters are in the expected format
    const error = isError(weight, minute)
    if (!error) {
      // we will not let users to follow their own accounts
      if (username !== userToAdd) {
        // we should make sure that user is a real user in the blockchain
        const result = await call(config.nodeURL, 'get_accounts', [[userToAdd]])
        if (result.length) {
          let exists = await con.query(
            'SELECT EXISTS(SELECT `user` FROM `commentupvote` WHERE `user`=? AND `commenter`=?)',
            [username, userToAdd]
          )
          for (let i in exists[0]) {
            exists = exists[0][i]
          }
          if (!exists) {
            const weight2 = weight * 100
            await con.query(
              'INSERT INTO `commentupvote`(`user`, `commenter`, `weight`, `aftermin`) VALUES (?,?,?,?)',
              [username, userToAdd, weight2, minute]
            )
            res.json({
              id: 1,
              result: 'Successfully added!'
            })
          } else {
            res.json({
              id: 0,
              error: 'Already added!'
            })
          }
        } else {
          res.json({
            id: 0,
            error: 'wrong username'
          })
        }
      } else {
        res.json({
          id: 0,
          error: 'You can not follow your account'
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

// this function will return true if received parameters was not in the expected format
const isError = (weight, minute) => {
  if (!isNaN(weight) && !isNaN(minute)) {
    weight = Number(weight)
    minute = Number(minute)
    // weight should be between 0.01 and 100
    if (weight < 0.01 || weight > 100) {
      return true
    }
    // we accept up to 30 minutes delay
    if (minute < 0 || minute > 30) {
      return true
    }
    return false
  } else {
    return true
  }
}

module.exports = router

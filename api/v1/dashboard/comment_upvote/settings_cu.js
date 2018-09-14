const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

router.post('/', async (req, res) => {
  const username = req.cookies.username
  const userToEdit = req.body.user
  const weight = req.body.weight
  const minute = req.body.minute
  const enable = req.body.enable
  if (username && userToEdit && weight && minute && enable) {
    const error = isError(weight, minute, enable)
    if (!error) {
      let exists = await con.query(
        'SELECT EXISTS(SELECT `user` FROM `commentupvote` WHERE `user`=? AND `commenter`=?)',
        [username, userToEdit]
      )
      for (let i in exists[0]) {
        exists = exists[0][i]
      }
      if (exists) {
        const weight2 = weight * 100
        await con.query(
          'UPDATE `commentupvote` SET `weight`=?, `aftermin`=?, `enable`=? WHERE `user`=? AND `commenter`=?',
          [weight2, minute, enable, username, userToEdit]
        )
        res.json({
          id: 1,
          result: 'settings successfully updated'
        })
      } else {
        res.json({
          id: 0,
          error: 'user not found!'
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

// this function will return true if one of parameters was not in the expected format
const isError = (weight, minute, enable) => {
  if (!isNaN(weight) && !isNaN(minute) && !isNaN(enable)) {
    weight = Number(weight)
    minute = Number(minute)
    enable = Number(enable)
    if (weight < 0.01 || weight > 100) {
      return true
    }
    if (minute < 0 || minute > 30) {
      return true
    }
    if (enable !== 0 && enable !== 1) {
      return true
    }
    return false
  } else {
    return true
  }
}

module.exports = router

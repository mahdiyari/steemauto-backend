const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

router.post('/', async (req, res) => {
  const username = req.cookies.username
  if (username) {
    const result = await con.query(
      'SELECT `claimreward` FROM `users` WHERE `user`=?',
      [username]
    )
    let claimReward = 0
    if (result[0].claimreward === 0) {
      claimReward = 1
    }
    await con.query(
      'UPDATE `users` SET `claimreward`=? WHERE `user`=?',
      [claimReward, username]
    )
    res.json({
      id: 1,
      result: 'Successfully ' + (claimReward ? 'enabled' : 'disabled')
    })
  } else {
    res.json({
      id: 0,
      error: 'required params missed'
    })
  }
})

module.exports = router

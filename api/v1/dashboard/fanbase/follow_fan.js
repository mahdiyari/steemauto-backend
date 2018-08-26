const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to follow a fan
router.post('/', async (req, res) => {
  const fan = req.body.fan
  const username = req.cookies.username
  if (fan && username) {
    // First we will make sure that fan exists in steemauto
    const fanExists = await con.query(
      'SELECT EXISTS(SELECT `fan` FROM `fans` WHERE `fan`=?)',
      [fan]
    )
    if (fanExists) {
      // we will make sure user is not already followed that fan
      const exists = await con.query(
        'SELECT EXISTS(SELECT `follower` FROM `fanbase` WHERE `fan`=? AND `follower`=?)',
        [fan, username]
      )
      if (!exists) {
        // Follow fan and increase the number of followers
        await con.query(
          'INSERT INTO `fanbase`(`fan`,`follower`,`weight`) VALUES (?,?,"10000")',
          [fan, username]
        )
        await con.query(
          'UPDATE `fans` SET `followers`=`followers`+1 WHERE `fan`=?',
          [fan]
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
      // fan is not in the database
      // we will insert that fan to the database
      // then follow and increase the number of followers
      await con.query(
        'INSERT INTO `fans`(`fan`) VALUES (?)',
        [fan]
      )
      await con.query(
        'INSERT INTO `fanbase`(`fan`,`follower`,`weight`) VALUES (?,?,"10000")',
        [fan, username]
      )
      await con.query(
        'UPDATE `fans` SET `followers`=`followers`+1 WHERE `fan`=?',
        [fan]
      )
      res.json({
        id: 1,
        result: 'Successfully followed with default settings!'
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

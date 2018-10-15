const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')
const call = require('../../../../helpers/nodeCall')
const config = require('../../../../config')

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
      // the user should not follow himself
      if (fan === username) {
        res.json({
          id: 0,
          error: 'You can not follow yourself!'
        })
      } else {
        // we will make sure user is not already followed that fan
        let exists = await con.query(
          'SELECT EXISTS(SELECT `follower` FROM `fanbase` WHERE `fan`=? AND `follower`=?)',
          [fan, username]
        )
        for (let i in exists[0]) {
          exists = exists[0][i]
        }
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
      }
    } else {
      // fan is not in the database
      // we will insert that fan to the database after checking fan's username
      // then follow and increase the number of followers
      const result = await call(config.nodeURL, 'condenser_api.get_accounts', [[fan]])
      if (result.length) {
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
      } else {
        res.json({
          id: 0,
          error: 'Wrong username!'
        })
      }
    }
  } else {
    res.json({
      id: 0,
      error: 'operation params missed'
    })
  }
})

module.exports = router

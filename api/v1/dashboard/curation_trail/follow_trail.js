const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')
const call = require('../../../../helpers/nodeCall')
const config = require('../../../../config')
const isAuth = require('../../../../middlewares/is_auth')

router.use(isAuth)

// user wants to follow a trail
router.post('/', async (req, res) => {
  try {
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
        // the user should not follow himself
        if (trail === username) {
          res.json({
            id: 0,
            error: 'You can not follow yourself!'
          })
        } else {
          // we will make sure user is not already followed that trail
          let exists = await con.query(
            'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `trailer`=? AND `follower`=?)',
            [trail, username]
          )
          for (let i in exists[0]) {
            exists = exists[0][i]
          }
          if (!exists) {
            // Follow trail and increase the number of followers
            await followTrail(trail, username)
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
        // We must validate username
        const result = await call(config.nodeURL, 'condenser_api.get_accounts', [[trail]])
        if (result.length) {
          // const description = 'None'
          // await con.query(
          //   'INSERT INTO `trailers`(`user`, `description`) VALUES (?,?)',
          //   [trail, description]
          // )
          // await followTrail(trail, username)
          // res.json({
          //   id: 1,
          //   result: 'Successfully followed!'
          // })
          res.json({
            id: 0,
            error: 'Not found'
          })
        } else {
          res.json({
            id: 0,
            error: 'Wrong username'
          })
        }
      }
    } else {
      res.json({
        id: 0,
        error: 'operation params missed'
      })
    }
  } catch (e) {
    res.json({
      id: 0,
      error: 'unexpected error'
    })
  }
})

const followTrail = async (trail, username) => {
  // we used SHA2 to create unique hash for pair of trail and user
  // this will prevent duplicate insert to the database
  await con.query(
    'INSERT INTO `followers`(`trailer`,`follower`,`weight`,`hash`) VALUES (?,?,"5000",SHA2(?, 256))',
    [trail, username, trail + username]
  )
  await con.query(
    'UPDATE `trailers` SET `followers`=`followers`+1 WHERE `user`=?',
    [trail]
  )
  return 1
}

module.exports = router

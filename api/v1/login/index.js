const express = require('express')
const router = express.Router()
const con = require('../../../helpers/mysql')
const scAuth = require('../../../helpers/steemconnect_call')
const crypto = require('crypto')

// This API will receive steemconnect 'access_token' and will assign 'access_key' to the users
// We will use 'access_key' in the '/middlewares/is_auth.js' to check users authorization
// This method will help us to check authorization locally by 'access_key'
// This method will used for both registration and login services
router.post('/', async (req, res) => {
  // if received an access_token, generate a new access_key
  const accessToken = req.body.access_token
  if (accessToken) {
    // We must make sure access_token is valid
    const result = await scAuth(accessToken)
    // if result === null then access_token is not valid
    if (result && result.user) {
      const username = result.user
      // generate random string
      // e.g. '27e4a97f7375b83e66a4870c8c41ab71fd1c350aee4f55fe570e36404faafe65787496ee'
      const accessKey = crypto.randomBytes(36).toString('hex')
      // we should check whether the user is registered or not
      let exists = await con.query(
        'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=?)',
        [username]
      )
      for (let i in exists[0]) {
        exists = exists[0][i]
      }
      if (exists) {
        // User is registered, so we will update 'access_key'
        await con.query(
          'UPDATE `users` SET `access_key`=? WHERE `user`=?',
          [accessKey, username]
        )
      } else {
        // it is a new user
        await con.query(
          'INSERT INTO `users`(`user`, `access_key`) VALUES (?, ?)',
          [username, accessKey]
        )
      }
      // We will need httpOnly cookies for 7days in the next version of steemauto
      res.cookie('access_key', accessKey, {expires: new Date(Date.now() + 604800000), httpOnly: true})
      res.cookie('username', username, {expires: new Date(Date.now() + 604800000), httpOnly: true})
      res.json({
        id: 1,
        access_key: accessKey,
        username,
        result: 'success'
      })
    } else {
      res.json({
        id: 0,
        error: 'Wrong access_token provided'
      })
    }
  } else if (req.cookies.access_key && req.cookies.username) {
    // User already has access_key in the cookies
    // we will check that access_key
    const accessKey = req.cookies.access_key
    const username = req.cookies.username
    let result = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=? AND `access_key`=?)',
      [username, accessKey]
    )
    for (let i in result[0]) {
      result = result[0][i]
    }
    if (result) {
      // access_key is valid
      res.json({
        id: 1,
        result: 'success'
      })
    } else {
      res.json({
        id: 0,
        error: 'Wrong access_key provided'
      })
    }
  } else {
    res.json({
      id: 0,
      error: 'required params missed'
    })
  }
})

module.exports = router

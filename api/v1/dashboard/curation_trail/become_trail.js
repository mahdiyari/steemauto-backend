const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// user wants to become a trail
router.post('/', async (req, res) => {
  const description = req.body.desc
  const username = req.cookies.username
  if (description && username) {
    // First we will make sure this user is not already a trail
    const trailExists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
      [username]
    )
    if (!trailExists) {
      // we will insert this user to the trails list
      await con.query(
        'INSERT INTO `trailers`(`user`, `description`) VALUES (?,?)',
        [username, description]
      )
      res.json({
        id: 1,
        result: 'Successfully added to the trail list!'
      })
    } else {
      // we will edit description for users who are already a trail
      await con.query(
        'UPDATE `trailers` SET `description`=? WHERE `user`=?',
        [description, username]
      )
      res.json({
        id: 1,
        result: 'Successfully edited!'
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

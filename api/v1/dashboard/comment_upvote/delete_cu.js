const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// we will delete a user from the comment_upvote list
router.post('/', async (req, res) => {
  const username = req.cookies.username
  const userToDelete = req.body.user
  if (username && userToDelete) {
    let exists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `commentupvote` WHERE `user`=? AND `commenter`=?)',
      [username, userToDelete]
    )
    for (let i in exists[0]) {
      exists = exists[0][i]
    }
    if (exists) {
      await con.query(
        'DELETE FROM `commentupvote` WHERE `user`=? AND `commenter`=?',
        [username, userToDelete]
      )
      res.json({
        id: 1,
        result: 'Successfully deleted!'
      })
    } else {
      res.json({
        id: 0,
        error: 'Already deleted!'
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

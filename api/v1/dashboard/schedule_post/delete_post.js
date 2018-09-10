const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// User wants to delete a post
// first, we will make sure this post is authored by that user
router.post('/', async (req, res) => {
  const username = req.cookies.username
  const postId = req.body.id
  if (username && postId) {
    if (!isNaN(postId) && Number(postId) > 0) {
      let postExists = await con.query(
        'SELECT EXISTS(SELECT * FROM `posts` WHERE `user`=? AND `id`=?)',
        [username, postId]
      )
      // MySQL will return result like: [{query: result}]
      // We should select result
      for (let i in postExists[0]) {
        postExists = postExists[0][i]
      }
      if (postExists) {
        await con.query(
          'DELETE FROM `posts` WHERE `posts`.`id` =?',
          [postId]
        )
        res.json({
          id: 1,
          result: 'Successfully removed'
        })
      } else {
        res.json({
          id: 0,
          error: 'post not found'
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

module.exports = router

const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')

// we will just edit title, tags, category, permlink, and content
router.post('/', async (req, res) => {
  const username = req.cookies.username
  const title = req.body.title
  const content = req.body.content
  const tags = JSON.parse(req.body.tags)
  const postId = req.body.id
  if (username && title && content && tags && postId) {
    const permlink = createPermlink(title)
    // checking parameters
    const error = isError(tags, postId)
    if (!error) {
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
          'UPDATE `posts` SET `title`=?, `content`=?, `maintag`=?, `permlink`=? WHERE `id`=? AND `user`=?',
          [title, content, tags[0], permlink, postId, username]
        )
        res.json({
          id: 1,
          result: 'Successfully edited'
        })
      } else {
        res.json({
          id: 0,
          error: 'Post not found'
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

// this function will return true(1) if params was not in the expected format
const isError = (tags, postId) => {
  if (Array.isArray(tags) && !isNaN(postId) && Number(postId) > 0) {
    // we accept up to 5 tags
    if (tags.length < 1 || tags.length > 5) {
      return 1
    }
    return 0
  } else {
    return 1
  }
}

// this function will clear any string and only will keep words, digits, and hyphens
const clean = (string) => {
  string = string.toLowerCase()
  string = string.replace(new RegExp(' ', 'g'), '-')
  string = string.replace(/[^a-z0-9-]/g, '')
  return string.replace(/-+/g, '-')
}

// we will use this function to generate unique permlinks by using 'current date'
const createPermlink = (title) => {
  title = clean(title)
  const date = new Date()
  const sec = date.getTime() / 1000
  const now = Math.floor(sec)
  const permlink = title + '-' + now
  return permlink
}

module.exports = router

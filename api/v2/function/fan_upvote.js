const express = require('express')
const router = express.Router()
const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')
const checkLimits = require('../../../helpers/checkLimits')
const upvote = require('../../../helpers/broadcastUpvote')
const upvoteLater = require('../../../helpers/upvoteLater')
const isEdited = require('../../../helpers/isEdited')

// this method will select followers of a fanbase
// then will send permlink and username to the upvote server
router.post('/', async (req, res) => {
  const fan = req.body.fan
  const permlink = req.body.permlink
  if (fan && permlink) {
    const edited = await isEdited(fan, permlink)
    if (!edited) {
      await fanUpvote(fan, permlink)
      res.json({
        id: 1,
        result: 'success'
      })
    } else {
      res.json({
        id: 0,
        error: 'edited post'
      })
    }
  } else {
    res.json({
      id: 0,
      error: 'required params missed'
    })
  }
})

const fanUpvote = async (fan, permlink) => {
  const exists = await con.query(
    'SELECT EXISTS(SELECT `follower` FROM `fanbase` WHERE `fan`=? AND `enable`=1 AND `limitleft`>0)',
    [fan]
  )
  if (selectExists(exists)) {
    const results = await con.query(
      'SELECT `follower`, `weight`, `aftermin` FROM `fanbase` WHERE `fan`=? AND `enable`=1 AND `limitleft`>0',
      [fan]
    )
    for (let result of results) {
      const follower = result.follower
      const aftermin = result.aftermin
      const weight = result.weight
      const nowdate = new Date()
      const nowsec = nowdate.getTime() / 1000
      const now = Math.floor(nowsec)
      // we should postpone upvote if user configured to upvote after x minutes
      if (aftermin > 0) {
        const time = parseInt(now + (aftermin * 60))
        upvoteLater(follower, fan, permlink, weight, time)
      } else {
        const result = await checkLimits(follower, fan, permlink, weight)
        if (result) await upvote(follower, fan, permlink, weight)
      }
    }
  }
}

module.exports = router

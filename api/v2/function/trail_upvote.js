const express = require('express')
const router = express.Router()
const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')
const checkLimits = require('../../../helpers/checkLimits')
const upvote = require('../../../helpers/broadcastUpvote')
const upvoteLater = require('../../../helpers/upvoteLater')

// this method will select followers of a curation trail
// then will send permlink and username to the upvote server
router.post('/', async (req, res) => {
  const trail = req.body.trail
  const author = req.body.author
  const permlink = req.body.permlink
  const weight = req.body.weight
  if (trail && author && permlink && weight) {
    if (!isNaN(weight) && Number(weight) > 0 && Number(weight) <= 100) {
      await trailUpvote(trail, author, permlink, weight)
      res.json({
        id: 1,
        result: 'success'
      })
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

const trailUpvote = async (trail, author, permlink, weight) => {
  const exists = await con.query(
    'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `trailer`=? AND `enable`=1)',
    [trail]
  )
  if (selectExists(exists)) {
    const results = await con.query(
      'SELECT `follower`, `votingway`, `weight`, `aftermin` FROM `followers` WHERE `trail`=? AND `enable`=1',
      [trail]
    )
    for (let result of results) {
      const follower = result.follower
      const votingway = result.votingway
      const aftermin = result.aftermin
      const nowdate = new Date()
      const nowsec = nowdate.getTime() / 1000
      const now = Math.floor(nowsec)
      // in scale method we will scale followers weight based on the trail vote weight
      if (votingway === 1) {
        weight = parseInt((result.weight / 10000) * weight)
      } else {
        weight = result.weight
      }
      // we should postpone upvote if user configured to upvote after x minutes
      if (aftermin > 0) {
        const time = parseInt(now + (aftermin * 60))
        upvoteLater(follower, author, permlink, weight, time)
      } else {
        const result = await checkLimits(follower, author, permlink, weight)
        if (result) await upvote(follower, author, permlink, weight)
      }
    }
  }
}

module.exports = router

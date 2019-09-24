const express = require('express')
const router = express.Router()
const con = require('../../../../helpers/mysql')
const call = require('../../../../helpers/nodeCall')
const config = require('../../../../config')

const CREATE_DOWNVOTE_THRESHOLD_SP = 1000

// user wants to become a trail
router.post('/', async (req, res) => {
  const description = req.body.desc
  const username = req.cookies.username
  let type = req.body.type
  if (type && (type === 2 || type === '2')) {
    type = 2
  } else {
    type = 1
  }
  if (description && username) {
    // make sure this user is not already a trail
    let trailExists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=? AND `type`=?)',
      [username, type]
    )
    // MySQL will return result like: [{query: result}]
    // We should select result
    for (let i in trailExists[0]) {
      trailExists = trailExists[0][i]
    }
    if (!trailExists) {
      if (type === 1) {
        // create curation trail
        await con.query(
          'INSERT INTO `trailers`(`user`, `description`) VALUES (?,?)',
          [username, description]
        )
        res.json({
          id: 1,
          result: 'Successfully added to the trail list!'
        })
      } else if (type === 2) {
        // create downvote trail
        const createTrail = await createDownvoteTrail(username, description)
        res.json(createTrail)
      }
    } else {
      // we will edit description for users who are already a trail
      await con.query(
        'UPDATE `trailers` SET `description`=? WHERE `user`=? AND `type`=?',
        [description, username, type]
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

/** Check threshold sp and create downvote trail */
const createDownvoteTrail = async (username, description) => {
  const type = 2
  const account = await call(config.nodeURL, 'condenser_api.get_accounts', [
    [username]
  ])
  const gb = await getGlobals()
  if (!account || !gb || !gb.tvfs || !gb.tvs) {
    return { id: 0, error: 'Bad request' }
  }
  const delegated = parseInt(
    account.delegated_vesting_shares.replace('VESTS', ''),
    10
  )
  const received = parseInt(
    account.received_vesting_shares.replace('VESTS', ''),
    10
  )
  const vesting = parseInt(account.vesting_shares.replace('VESTS', ''), 10)
  const totalvest = vesting + received - delegated
  const spv = gb.tvfs / gb.tvs
  const totalsp = (totalvest * spv).toFixed(3)
  if (totalsp < CREATE_DOWNVOTE_THRESHOLD_SP) {
    return { id: 0, error: 'You need at least 1,000 SP' }
  }
  await con.query(
    'INSERT INTO `trailers`(`user`, `description`, `type`) VALUES (?,?,?)',
    [username, description, type]
  )
  return { id: 1, result: 'Trail successfully created' }
}

/** return global variables (tvfs & tvs) */
const getGlobals = async () => {
  try {
    const res = await call(
      config.nodeURL,
      'condenser_api.get_dynamic_global_properties',
      []
    )
    if (!res) {
      return null
    }
    const tvfs = res['result'].total_vesting_fund_steem.replace('STEEM', '')
    const tvs = res['result'].total_vesting_shares.replace('VESTS', '')
    return { tvfs, tvs }
  } catch (e) {
    return null
  }
}

module.exports = router

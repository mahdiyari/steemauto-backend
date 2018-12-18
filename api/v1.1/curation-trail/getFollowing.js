const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')

const getFollowing = async user => {
  if (!user) {
    return {
      id: 0,
      error: 'missing params'
    }
  }
  const exists = await con.query(
    'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=?)',
    [user]
  )
  if (!selectExists(exists)) {
    return {
      id: 0,
      error: 'user not found'
    }
  }
  const resultExists = await con.query(
    'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `follower`=?)',
    [user]
  )
  if (!selectExists(resultExists)) {
    return {
      id: 0,
      error: 'not following anyone'
    }
  }
  const result = await con.query(
    'SELECT `trailer`, `weight`, `votingway`, `aftermin`, `enable` FROM `followers` WHERE `follower`=?',
    [user]
  )
  for (const trail of result) {
    trail.followers = await getFollowersCount(trail.trailer)
  }
  return {
    id: 1,
    result: result
  }
}

const getFollowersCount = async trail => {
  const result = await con.query(
    'SELECT `followers` FROM `trailers` WHERE `user`=?',
    [trail]
  )
  return result ? result[0] ? result[0]['followers'] : 0 : 0
}

module.exports = getFollowing

const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')

/** Get details of one or all followed trails;
 * {trail: null => all followed trails,
 * trail: string => one specific trail}
 */
const getFollowing = async (user, trail) => {
  if (!user) {
    return {
      id: 0,
      error: 'missing params'
    }
  }
  // I think it is useless to check user here
  // because we already checked in isAuth() middleware
  // TODO: perhaps remove this part
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

  // return details for one or all of curation trails based on the trail variable
  const params = trail ? [user, trail] : [user]
  const extraQuery = trail ? ' AND `trailer`=?' : ''

  const resultExists = await con.query(
    'SELECT EXISTS(SELECT `follower` FROM `followers` WHERE `follower`=?' +
      extraQuery +
      ')',
    params
  )
  if (!selectExists(resultExists)) {
    return {
      id: 0,
      error: 'not following anyone'
    }
  }
  const result = await con.query(
    'SELECT `trailer`,`weight`,`votingway`,`aftermin`,`enable`,`selfvote`,`commentvote`,' +
      '`tagmethod`,`authormethod`,`tags`,`authors` FROM `followers` WHERE `follower`=?' +
      extraQuery,
    params
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
  return result ? (result[0] ? result[0]['followers'] : 0) : 0
}

module.exports = getFollowing

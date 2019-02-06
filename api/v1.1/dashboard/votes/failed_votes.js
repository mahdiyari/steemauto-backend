const con = require('../../../../helpers/mysql')
const selectExists = require('../../../../helpers/select_exists')

const getFailedVotes = async (user) => {
  const weekAgo = Date.now() / 1000 - 604800
  const exists = await con.query(
    'SELECT EXISTS(SELECT `voter` FROM `failed_votes` WHERE `voter`=? AND `timestamp`>?)',
    [user, weekAgo]
  )
  if (!selectExists(exists)) {
    return {
      id: 0,
      error: 'No votes.'
    }
  } else {
    const result = await con.query(
      'SELECT `author`, `permlink`, `error`, `timestamp` FROM `failed_votes`' +
      'WHERE `voter`=? AND `timestamp`>?' +
      'ORDER BY `failed_votes`.`id` DESC LIMIT 50',
      [user, weekAgo]
    )
    return {
      id: 1,
      result
    }
  }
}

module.exports = getFailedVotes

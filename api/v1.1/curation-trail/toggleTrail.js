const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')

/** This function updates the `enable` column in the database for a trail
 * @param user the username comes with cookies
 * @param trail trail name comes with post request
 * @param enable we should set this on the server side (1 || 0), this is not an input by user
 */
const toggleTrail = async (user, trail, enable) => {
  const exists = await con.query(
    'SELECT EXISTS(SELECT `trailer` FROM `followers` WHERE `follower`=? AND `trailer`=?)',
    [user, trail]
  )
  if (!selectExists(exists) || isNaN(enable)) {
    return {
      id: 0,
      error: 'wrong details'
    }
  }
  await con.query(
    'UPDATE `followers` SET `enable`=? WHERE `follower`=? AND `trailer`=?',
    [enable, user, trail]
  )
  return {
    id: 1,
    result: 'Successfully updated'
  }
}

module.exports = toggleTrail

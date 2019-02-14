const updateDatabase = require('../../../../helpers/updateDatabase')
const validate = require('./helpers/validate')

/** This function updates any disable/enable (0/1) column in the database for trails
 * @param {string} user the username comes with cookies
 * @param {array} trails trails[] name comes with post request
 * @param {string} column column name which accepts 0 or 1 (server side input)
 * @param {number} enable Server side input (0 or 1)
 */
const toggleTrailVar = async (user, trails, column, enable) => {
  // validating inputs
  if (!validate.trails(trails) || isNaN(enable)) {
    return {
      id: 0,
      error: 'max 25 trails'
    }
  }

  const set = {}
  set[column] = enable
  // update database with customized function
  const result = await updateDatabase(
    'followers',
    set,
    '`follower`=? AND `trailer` IN (?)',
    [user, trails]
  )

  if (!result) {
    return {
      id: 0,
      error: 'Not found'
    }
  }

  return {
    id: 1,
    result: 'Successfully updated'
  }
}

module.exports = toggleTrailVar

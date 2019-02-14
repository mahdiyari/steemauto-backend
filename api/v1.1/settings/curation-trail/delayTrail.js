const updateDatabase = require('../../../../helpers/updateDatabase')
const validate = require('./helpers/validate')

/** This function updates the `aftermin` column in the database for trails
 * @param {string} user the username comes with cookies
 * @param {array} trails trails[] name comes with post request
 * @param {number} delay time to wait before voting (0 ~ 30) in minutes
 */
const delayTrail = async (user, trails, delay) => {
  // validating inputs
  delay = Number(delay)
  if (
    !validate.trails(trails) ||
    !validate.delay(delay)
  ) {
    return {
      id: 0,
      error: 'wrong params'
    }
  }

  const result = await updateDatabase(
    'followers',
    {
      aftermin: parseInt(delay)
    },
    '`follower`=? AND `trailer` IN (?)',
    [user, trails]
  )

  if (!result) {
    return {
      id: 1,
      result: 'Successfully updated'
    }
  }

  return {
    id: 1,
    result: 'Successfully updated'
  }
}

module.exports = delayTrail

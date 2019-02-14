const updateDatabase = require('../../../../helpers/updateDatabase')
const validate = require('./helpers/validate')

/** This function updates the `weight` and `votingway` column in the database for trails
 * @param {string} user the username comes with cookies
 * @param {array} trails trails[] name comes with post request
 * @param {number} votingway voting method (1 or 2)
 * @param {number} voting weight (0.1 ~ 100)
 */
const weightTrail = async (user, trails, votingway, weight) => {
  // validating inputs
  votingway = Number(votingway)
  weight = Number(weight)
  if (
    !validate.trails(trails) ||
    !validate.votingMethod(votingway) ||
    !validate.weight(weight)
  ) {
    return {
      id: 0,
      error: 'wrong params'
    }
  }

  const result = await updateDatabase(
    'followers',
    {
      votingway,
      weight: parseInt(weight * 100)
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

module.exports = weightTrail

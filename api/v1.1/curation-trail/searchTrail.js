const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')
const validateAccount = require('../../../helpers/validateAccount')

/** Return top curation trails by number of followers */
const getTopTrails = async trail => {
  if (!trail) {
    return {
      id: 0,
      error: 'bad params'
    }
  }
  const isValid = await validateAccount(trail)
  if (!isValid) {
    return {
      id: 0,
      error: 'Wrong username'
    }
  }
  const exists = await con.query(
    'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
    [trail]
  )
  if (!selectExists(exists)) {
    return {
      id: 0,
      error: 'Trail not found'
    }
  }
  const result = await con.query(
    'SELECT `user`, `description`, `followers` FROM `trailers` WHERE `user`=?',
    [trail]
  )
  return {
    id: 1,
    result: result ? result[0] : { name: '', followers: '', description: '' }
  }
}

module.exports = getTopTrails

const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')

/** Return curation trail information
 * description, followers, ...
 */
const getInfo = async (trail) => {
  const userRegex = /^[a-zA-Z0-9\-.]+$/
  if (!trail.match(userRegex)) {
    return {
      id: 0,
      error: 'invalid user'
    }
  }
  const exists = await con.query(
    'SELECT EXISTS(SELECT `user` FROM `trailers` WHERE `user`=?)',
    [trail]
  )
  if (!selectExists(exists)) {
    return {
      id: 0,
      error: 'not found'
    }
  }
  const result = await con.query(
    'SELECT `user`, `description`, `followers`, `vip`, `landing_img`, `landing_text` FROM `trailers` WHERE `user`=?',
    [trail]
  )
  if (result && result[0] && !result[0].vip) {
    delete result[0].landing_img
    delete result[0].landing_text
  }
  return {
    id: 1,
    result
  }
}

module.exports = getInfo

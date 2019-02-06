const con = require('../../../../helpers/mysql')
const selectExists = require('../../../../helpers/select_exists')

const getLimits = async user => {
  if (user) {
    const exists = await con.query(
      'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=?)',
      [user]
    )
    if (selectExists(exists)) {
      const result = await con.query(
        'SELECT `limit_power`, `limit_rc` FROM `users` WHERE `user`=?',
        [user]
      )
      return {
        id: 1,
        mana_limit: result[0].limit_power,
        rc_limit: result[0].limit_rc
      }
    } else {
      return {
        id: 0,
        error: 'user not found'
      }
    }
  } else {
    return {
      id: 0,
      error: 'bad params'
    }
  }
}

module.exports = getLimits

const con = require('../../../../helpers/mysql')
const selectExists = require('../../../../helpers/select_exists')

const setLimits = async (user, type, limit) => {
  if (!user || !type || !limit) {
    return {
      id: 0,
      error: 'bad request'
    }
  }
  const exists = await con.query(
    'SELECT EXISTS(SELECT `user` FROM `users` WHERE `user`=?)',
    [user]
  )
  if (selectExists(exists)) {
    if (isNaN(limit) || Number(limit) < 1 || Number(limit) > 99) {
      return {
        id: 0,
        error: 'error! min is 1% and max is 99%'
      }
    }
    switch (type) {
      case 'mana':
        await updateManaLimit(user, limit)
        break
      case 'rc':
        await updateRCLimit(user, limit)
        break
      default:
        return {
          id: 0,
          error: 'bad params'
        }
    }
    return {
      id: 1,
      result: 'successfully updated'
    }
  }
}

const updateManaLimit = async (user, limit) => {
  await con.query('UPDATE `users` SET `limit_power`=? WHERE `user`=?', [
    limit,
    user
  ])
  return 1
}
const updateRCLimit = async (user, limit) => {
  await con.query('UPDATE `users` SET `limit_rc`=? WHERE `user`=?', [
    limit,
    user
  ])
  return 1
}

module.exports = setLimits

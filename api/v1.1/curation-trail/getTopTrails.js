const con = require('../../../helpers/mysql')
const selectExists = require('../../../helpers/select_exists')

const getTopTrails = async () => {
  const exists = await con.query(
    'SELECT EXISTS(SELECT `user` FROM `trailers` LIMIT 1)'
  )
  if (!selectExists(exists)) {
    return {
      id: 0,
      error: 'No trails'
    }
  }
  const result = await con.query(
    'SELECT `user`, `description`, `followers` FROM `trailers` ORDER BY `followers` DESC LIMIT 50'
  )
  return {
    id: 1,
    result
  }
}

module.exports = getTopTrails

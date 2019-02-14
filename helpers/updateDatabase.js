const con = require('./mysql')
const selectExists = require('./select_exists')

/**
 * Check database and update requested columns
 * @param {string} table database table name
 * @param {object} vars object with pair of key = value
 * @param {string} conditions anything after WHERE
 * @param {array} params params in array
 */
const updateDatabase = async (table, vars, conditions, params) => {
  // make sure this particular row exists in the table
  const exists = await con.query(
    'SELECT EXISTS(SELECT `id` FROM ?? WHERE ' + conditions + ')',
    [table].concat(params)
  )
  if (!selectExists(exists)) {
    return false
  }

  // update table and return true for success
  await con.query(
    'UPDATE ?? SET ? WHERE ' + conditions,
    [table, vars].concat(params)
  )
  return true
}

module.exports = updateDatabase

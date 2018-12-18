const call = require('./nodeCall')
const config = require('../config.js')
const nodeURL = config.privateNodeUrl

// This function will return false for invalid usernames
const isValid = async user => {
  const result = await call(nodeURL, 'condenser_api.get_accounts', [[user]])
  if (result && result[0] && result[0].name === user) {
    return true
  }
  return false
}

module.exports = isValid

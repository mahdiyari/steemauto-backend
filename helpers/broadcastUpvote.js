const fetch = require('node-fetch')
const config = require('../config')
const queue = require('./queue')
// this function will send post and voter information to another app to upvote
const upvote = async (voter, author, permlink, weight) => {
  try {
    queue(async () => {
      // Upvote server url for handling upvotes
      const url = config.upvoteServer +
        '?wif=' + config.wifKey +
        '&voter=' + voter +
        '&author=' + author +
        '&permlink=' + permlink +
        '&weight=' + weight
      await fetch(url)
    }, 50)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = upvote

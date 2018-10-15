const call = require('./nodeCall')
const config = require('../config')
const nodeURL = config.privateNodeURL

// This function will return true for edited posts
const isEdited = async (author, permlink) => {
  const content = await call(
    nodeURL,
    'condenser_api.get_content',
    [
      author,
      permlink
    ]
  )
  if (content && content.last_update > content.created) return true
  return false
}

module.exports = isEdited

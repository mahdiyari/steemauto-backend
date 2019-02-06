const con = require('./mysql')
// We will add post detail to the database to upvote later
const upvoteLater = async (voter, author, permlink, weight, aftermin) => {
  await con.query(
    'INSERT INTO `upvotelater`' +
    '(`voter`, `author`, `permlink`, `weight`, `time`)' +
    'VALUES (?,?,?,?,?)',
    [voter, author, permlink, weight, aftermin]
  )
}

module.exports = upvoteLater

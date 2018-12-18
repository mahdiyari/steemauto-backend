const con = require('../../../helpers/mysql')

const getStats = async () => {
  const result = await con.query(
    'SELECT `total_users`, `daily_votes`, `daily_posts` FROM `stats` WHERE `id`=0'
  )
  return ({
    id: 1,
    totalUsers: result[0].total_users,
    dailyVotes: result[0].daily_votes,
    dailyPosts: result[0].daily_posts
  })
}

module.exports = getStats

const mysql = require('mysql')
const config = require('../config')

// creating a MySQL pool which will handle limited connections
// more connections may cause problems on low-end servers
// in the cluster mode, the limitation will be multiplied by the number of instances!
const pool = mysql.createPool({
  connectionLimit: process.env.DB_LIMIT || 25,
  host: config.db.host,
  user: config.db.user,
  password: config.db.pw,
  database: config.db.name,
  charset: config.db.charset
})

// Rewriting MySQL query method as a promise
const con = {}
con.query = async (query, val) => {
  if (val) {
    let qu = await new Promise((resolve, reject) => {
      pool.query(query, val, (error, results) => {
        if (error) reject(new Error(error))
        resolve(results)
      })
    })
    return qu
  } else {
    let qu = await new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) reject(new Error(error))
        resolve(results)
      })
    })
    return qu
  }
}

module.exports = con

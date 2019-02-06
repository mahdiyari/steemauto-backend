/** verify requests host */
const safeHost = (req, res, next) => {
  const origin = req.headers.origin
  if (
    origin === 'https://steemauto.com' ||
    origin === 'http://localhost:4200' // development host
  ) {
    next()
  } else {
    res.status(403)
  }
}

module.exports = safeHost

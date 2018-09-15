const fetch = require('node-fetch')
const steemConnectAPI = 'https://steemconnect.com/api/me'

const scAuth = async (accessToken) => {
  try {
    const result = await fetch(
      steemConnectAPI,
      {
        method: 'POST',
        headers: {
          Authorization: accessToken
        }
      }
    )
    if (result.ok) {
      const res = await result.json()
      return res
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

module.exports = scAuth

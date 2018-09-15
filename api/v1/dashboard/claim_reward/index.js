const express = require('express')
const app = express()

const toggleClaim = require('./toggle_claim')
const isAuth = require('../../../../middlewares/is_auth')
// Check login information for all api calls
app.use(isAuth)
app.use('/toggle', toggleClaim)

module.exports = app

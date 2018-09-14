const express = require('express')
const app = express()

const toggleClaim = require('./toggle_claim')

app.use('/toggle', toggleClaim)

module.exports = app

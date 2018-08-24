const express = require('express')
const app = express()
const followFan = require('./follow_fan')

app.use('/follow', followFan)

module.exports = app

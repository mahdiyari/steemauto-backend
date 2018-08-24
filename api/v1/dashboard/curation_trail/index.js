const express = require('express')
const app = express()
const followTrail = require('./follow_trail')
const unfollowTrail = require('./unfollow_trail')

app.use('/follow', followTrail)
app.use('/unfollow', unfollowTrail)

module.exports = app

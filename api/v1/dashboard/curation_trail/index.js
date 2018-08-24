const express = require('express')
const app = express()
const followTrail = require('./follow_trail')
const unfollowTrail = require('./unfollow_trail')
const settingsTrail = require('./settings_trail')
const becomeTrail = require('./become_trail')

app.use('/follow', followTrail)
app.use('/unfollow', unfollowTrail)
app.use('/settings', settingsTrail)
app.use('/become', becomeTrail)

module.exports = app

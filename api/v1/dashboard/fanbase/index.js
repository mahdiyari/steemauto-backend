const express = require('express')
const app = express()
const followFan = require('./follow_fan')
const unfollowFan = require('./unfollow_fan')
const settingsFan = require('./settings_fan')
const isAuth = require('../../../../middlewares/is_auth')
// Check login information for all api calls
app.use(isAuth)
app.use('/follow', followFan)
app.use('/unfollow', unfollowFan)
app.use('/settings', settingsFan)

module.exports = app

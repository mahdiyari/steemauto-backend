const express = require('express')
const app = express()
const trailUpvote = require('./trail_upvote')

app.use('/trail_upvote', trailUpvote)

module.exports = app

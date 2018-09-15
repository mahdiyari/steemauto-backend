const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hpp = require('hpp')
const app = express()

const curationTrail = require('./api/v1/dashboard/curation_trail')
const fanbase = require('./api/v1/dashboard/fanbase')
const schedulePost = require('./api/v1/dashboard/schedule_post')
const commentUpvote = require('./api/v1/dashboard/comment_upvote')
const claimReward = require('./api/v1/dashboard/claim_reward')
const loginMethod = require('./api/v1/login')

// support json encoded bodies and encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// more info: www.npmjs.com/package/hpp
app.use(hpp())

app.use('/api/v1/dashboard/curation_trail', curationTrail)
app.use('/api/v1/dashboard/fanbase', fanbase)
app.use('/api/v1/dashboard/schedule_post', schedulePost)
app.use('/api/v1/dashboard/comment_upvote', commentUpvote)
app.use('/api/v1/dashboard/claim_reward', claimReward)
app.use('/api/v1/login', loginMethod)

const port = process.env.PORT || 3001
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log(`Application started on ${host}:${port}`)
})

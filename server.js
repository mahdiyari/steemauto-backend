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
const logoutMethod = require('./api/v1/logout')
const dashboardFront = require('./api/v1.1/dashboard')
const curationTrailFront = require('./api/v1.1/curation-trail')
// Processing backend processes (private api)
const v2Function = require('./api/v2/function')

// support json encoded bodies and encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// more info: www.npmjs.com/package/hpp
app.use(hpp())

app.use('/api/v1/dashboard/curation_trail', curationTrail)
app.use('/api/v1/dashboard/fanbase', fanbase)
app.use('/api/v1/dashboard/schedule_post', schedulePost)
app.use('/api/v1/dashboard/comment_upvote', commentUpvote)
app.use('/api/v1/dashboard/claim_reward', claimReward)
app.use('/api/v1/login', loginMethod)
app.use('/api/v1/logout', logoutMethod)

app.use('/api/v1.1/dashboard', dashboardFront)
app.use('/api/v1.1/curation-trail', curationTrailFront)

app.use('/api/v2/function', v2Function)

const port = process.env.PORT || 3001
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log(`Application started on ${host}:${port}`)
})

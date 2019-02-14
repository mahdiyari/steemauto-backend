const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hpp = require('hpp')
const app = express()
const helmet = require('helmet')
const isAuth = require('./middlewares/is_auth')

const curationTrail = require('./api/v1/dashboard/curation_trail')
const fanbase = require('./api/v1/dashboard/fanbase')
const schedulePost = require('./api/v1/dashboard/schedule_post')
const commentUpvote = require('./api/v1/dashboard/comment_upvote')
const claimReward = require('./api/v1/dashboard/claim_reward')
const loginMethod = require('./api/v1/login')
const logoutMethod = require('./api/v1/logout')
const dashboardFront = require('./api/v1.1/dashboard')
const curationTrailFront = require('./api/v1.1/curation-trail')

const publicCurationTrail = require('./api/public/curation-trail')

// Processing backend processes (private api)
const v2Function = require('./api/v2/function')

// Settings imports
const curationTrailSettings = require('./api/v1.1/settings/curation-trail')

// support json encoded bodies and encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(function (req, res, next) {
  /** TODO: add ENV var for development mode */
  const dev = 1
  res.header('Access-Control-Allow-Origin', (dev ? 'http://localhost:4200' : 'https://steemauto.com'))
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, access_key')
  next()
})

app.use(helmet())

// more info: www.npmjs.com/package/hpp
app.use(hpp())

app.use('/api/v1/dashboard/curation-trail', curationTrail)
app.use('/api/v1/dashboard/fanbase', fanbase)
app.use('/api/v1/dashboard/schedule_post', schedulePost)
app.use('/api/v1/dashboard/comment_upvote', commentUpvote)
app.use('/api/v1/dashboard/claim_reward', claimReward)
app.use('/api/v1/login', loginMethod)
app.use('/api/v1/logout', logoutMethod)

app.use('/api/v1.1/dashboard', dashboardFront)
app.use('/api/v1.1/curation-trail', isAuth)
app.use('/api/v1.1/curation-trail', curationTrailFront)

app.use('/api/v2/function', v2Function)

app.use('/api/public/curation-trail', publicCurationTrail)

// All settings APIs
app.use('/api/v1.1/settings/curation-trail', curationTrailSettings)

const port = process.env.PORT || 3001
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log(`Application started on ${host}:${port}`)
})

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hpp = require('hpp')
const app = express()
const isAuth = require('./middlewares/is_auth')
const curationTrail = require('./api/v1/dashboard/curation_trail')
const fanbase = require('./api/v1/dashboard/fanbase')

// support json encoded bodies and encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// more info: www.npmjs.com/package/hpp
app.use(hpp())

// Check login information for all api calls
app.use(isAuth)
app.use('/api/v1/dashboard/curation_trail', curationTrail)
app.use('/api/v1/dashboard/fanbase', fanbase)

const port = process.env.PORT || 3001
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
  console.log(`Application started on ${host}:${port}`)
})

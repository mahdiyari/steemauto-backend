const express = require('express')
const app = express()
const submitPost = require('./submit_post')

app.use('/submit', submitPost)

module.exports = app

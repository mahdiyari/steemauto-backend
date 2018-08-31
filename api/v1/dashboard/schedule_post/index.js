const express = require('express')
const app = express()
const submitPost = require('./submit_post')
const deletePost = require('./delete_post')

app.use('/submit', submitPost)
app.use('/delete', deletePost)

module.exports = app

const express = require('express')
const app = express()
const submitPost = require('./submit_post')
const deletePost = require('./delete_post')
const editPost = require('./edit_post')

app.use('/submit', submitPost)
app.use('/delete', deletePost)
app.use('/edit', editPost)

module.exports = app

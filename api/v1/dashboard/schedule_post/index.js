const express = require('express')
const app = express()
const submitPost = require('./submit_post')
const deletePost = require('./delete_post')
const editPost = require('./edit_post')
const isAuth = require('../../../../middlewares/is_auth')
// Check login information for all api calls
app.use(isAuth)
app.use('/submit', submitPost)
app.use('/delete', deletePost)
app.use('/edit', editPost)

module.exports = app

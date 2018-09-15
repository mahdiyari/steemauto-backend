const express = require('express')
const app = express()

const addUser = require('./add_cu')
const deleteUser = require('./delete_cu')
const settingsUser = require('./settings_cu')
const isAuth = require('../../../../middlewares/is_auth')
// Check login information for all api calls
app.use(isAuth)
app.use('/add', addUser)
app.use('/delete', deleteUser)
app.use('/settings', settingsUser)

module.exports = app

const express = require('express')
const app = express()

const addUser = require('./add_cu')
const deleteUser = require('./delete_cu')
const settingsUser = require('./settings_cu')

app.use('/add', addUser)
app.use('/delete', deleteUser)
app.use('/settings', settingsUser)

module.exports = app

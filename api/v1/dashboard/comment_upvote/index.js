const express = require('express')
const app = express()

const addUser = require('./add_cu')
const deleteUser = require('./delete_cu')

app.use('/add', addUser)
app.use('/delete', deleteUser)

module.exports = app

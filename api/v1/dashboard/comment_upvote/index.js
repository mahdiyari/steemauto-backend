const express = require('express')
const app = express()

const addUser = require('./add_cu')

app.use('/add', addUser)

module.exports = app

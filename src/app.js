const express = require('express')
require('../src/db/mongoose')
const userRouter = require('./router/users')
const friendRouter = require('./router/friends')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(friendRouter)


module.exports = app
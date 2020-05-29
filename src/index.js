const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/users')
const friendRouter = require('./router/friends')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(friendRouter)


app.listen(3000,() => {
    console.log('server started at 3000')
})
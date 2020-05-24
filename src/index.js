const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/users')

const app = express()

app.use(express.json())
app.use(userRouter)


app.listen(3000,() => {
    console.log('server started at 3000')
})
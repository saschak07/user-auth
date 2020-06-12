const mongoose = require('mongoose')
const User = require('../../src/models/user')
const jwt = require('jsonwebtoken')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    userName: 'dhichidhichi',
    email: 'dhichi@kichi.com',
    passwd: 'tongtongdhechu',
    tokens: [{
        token: jwt.sign({_id: 'dhichidhichi'}, process.env.JWT_SECRET)
    }]
}

const setUpDbBeforeTest = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = { setUpDbBeforeTest,
    userOne 
}
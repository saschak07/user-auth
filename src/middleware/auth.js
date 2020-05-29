const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth  = async (req, res, next) => {
 try{
 const token = req.header('Authorization')
 if(!token){
     throw new Error('Token required!!')
    }
 const decoded = jwt.verify(token.replace('Bearer ',''),'hare krishna')
 console.log(decoded)
 const user = await User.findOne({userName: decoded._id})
 console.log(user)
 if(!user){
     throw new Error('Wrong token!!')
 }
 req.user = user
 next()
}catch(e){
    console.log(e)
    res.status(401).send({errorMsg: e.message})
}
}

module.exports = auth
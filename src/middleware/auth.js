const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth  = async (req, res, next) => {
 try{
 const token = req.header('Authorization').replace('Bearer ','')
 if(!token){
     throw new Error('Token required!!')
    }
 const decoded = jwt.verify(token,process.env.JWT_SECRET)
 const user = await User.findOne({userName: decoded._id})
 const savedToken = user.tokens.filter(instance => instance.token===token)
 console.log('logged in user:'+user.userName)
 if(!user || savedToken.length===0){
     throw new Error('Wrong token!!')
 }
 req.user = user
 req.token = token
 next()
}catch(e){
    console.log(e)
    res.status(401).send({errorMsg: e.message})
}
}

module.exports = auth
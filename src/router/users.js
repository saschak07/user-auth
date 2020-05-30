const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.get('/user/me',auth,async (req,res) => {
    try{
        const user  = req.user;
        if(!user){
            res.status(400).send('user name not available!')
        }
        res.status(200).send({userName: user.userName,
        email: user.email})
    }catch(e){
        res.status(503).send({errorMsg: e.message})
    }
})

router.post('/user',async(req,res) => {
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({userName: user.userName, token})
    }catch(e){
        res.status(503).send({errorMsg: e.message})
    }

})
router.post('/user/login',async(req,res) => {
    try{
        const user = await User.findUserByCreds(req.body.userName,req.body.passwd)
        const token  = await user.generateToken()
        res.status(200).send({userName: user.userName, token})
    }catch(e){
        console.log(e)
        res.status(401).send({errorMsg: e.message})
    }

})

module.exports = router

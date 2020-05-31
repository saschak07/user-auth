const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.get('/user/me',auth,async (req,res) => {
    try{
        const user = await req.user.populate({
            path:'friends',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
    }).execPopulate();
        res.status(200).send({user, friends: user.friends})
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

router.post('/user/logout',auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token!==req.token)
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send({errorMsg: e.message})
    }
})

router.delete('/user/:me', auth, async(req, res) => {
    try{
        const user = req.user
        user.remove()
        res.status(200).send()
    }catch(e){
        res.status(500).send({errorMsg: e.message})
    }
} )

module.exports = router

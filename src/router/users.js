const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.get('/user/:userName',async (req,res) => {
    try{
        const user  = await User.findOne({userName:req.params.userName})
        if(!user){
            res.status(400).send('user name not available!')
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/user',async(req,res) => {
    try{
        const user = new User(req.body)
        await user.save()
        res.status(200).send(user)
    }catch(e){
        res.status(503).send(e)
    }

})
router.post('/user/login',async(req,res) => {
    try{
        const user = await User.findUserByCreds(req.body.userName,req.body.passwd)
        if(!user){
            res.status(401).send("Wrong credentials !!!")
        }
        res.status(200).send("Authenticated ....")
    }catch(e){
        console.log(e)
        res.status(401).send('Wrong creds')
    }

})

module.exports = router

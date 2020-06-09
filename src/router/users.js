const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

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


const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/photo', auth, upload.single('photo'), async(req,res) =>{
    try{
        const photoBuffer = await sharp(req.file.buffer).resize({width: 150, height:150}).png().toBuffer()
        req.user.photo = photoBuffer
        await req.user.save()
        res.status(200).send('successful upload')

    }catch(e){
        res.status(500).send({errMsg: e.message})
    }
})

router.get('/users/:userName/photo', async(req,res)=> {
    try{
        const user = await User.findOne({userName: req.params.userName})
        if(!user || !user.photo){
            throw new Error('no image found')
        }
        else{
            res.set('contentType', 'image/png')
            res.send(user.photo)
        }
    }catch(e){
        res.status(500).send({errMsg: e.message})
    }
})


module.exports = router

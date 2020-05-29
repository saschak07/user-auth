const express = require('express')
const Friend = require('../models/friend')
const auth = require('../middleware/auth')


const router = new express.Router()

router.post('/friends',auth, async(req,res) => {

    const friend = new Friend({...req.body,
    source: req.user._id})

    try{
        await friend.save()
        res.status(201).send(friend)

    }catch(e){
        res.status(500).send(e)
    }

})

module.exports = router
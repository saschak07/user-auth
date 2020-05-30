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

router.get('/friends', auth, async(req,res) => {
    try{
        const friends = await Friend.find({source: req.user._id})
    if(!friends){
        res.status(404).send('Friends not found')
    }
    res.status(200).send(friends)
    }catch(e){
        res.status(500).send(e.messagge)
    }

})

router.put('/friends/:name',auth, async(req,res) => {
    try{
        const allowedUpdates = ['name','isRelative']
        const updates = Object.keys(req.body)
        if(!updates.every(data => allowedUpdates.includes(data))){
            res.status(400).send('wrong update fields!!!')
        }
        const friend = await Friend.findOne({name:req.params.name, source: req.user._id})
        if(!friend){
            res.status(400).send('friend not found')
        }
        updates.forEach(update => friend[update]=req.body[update])
        await friend.save()
        res.status(200).send(friend)
    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router
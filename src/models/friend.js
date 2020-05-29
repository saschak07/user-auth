const mongoose = require('mongoose')


const friend = mongoose.model('friend',{
    name: {
        type: String,
        required: true,
    },
    isRelative:{
        type: Boolean,
        default: false
    },
    source: {
        type : mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})

module.exports = friend


const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
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
},{
    timestamps: true
})

const friend = mongoose.model('friend',friendSchema)

module.exports = friend


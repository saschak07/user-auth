const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 6,
        unique: true

    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email adderss!')
            }
        } 
    },
    passwd: {
        type: String,
        required: true,
        minlength: 6,

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const User = mongoose.model('user',userSchema)

module.exports = User

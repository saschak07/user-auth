const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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

userSchema.pre('save', async function(){
    const user = this
    if(user.isModified('passwd')){
    user.passwd =  await bcrypt.hash(user.passwd,8)
    }
})

userSchema.statics.findUserByCreds = async (userName,passwd) => {
        const user = await User.findOne({userName})
        if(!user){
            throw new Error('User name does not exist!')
        }
        if(!await bcrypt.compare(passwd,user.passwd)){
            console.log(passwd)
            console.log(user.passwd)
            throw new Error('Pass word is incorrect!!!')
        }
        return user
   }
userSchema.methods.generateToken = async function(){
 const user = this
 const token = await jwt.sign({_id: user.userName},'hare krishna')
 user.tokens = user.tokens.concat({token})
 await user.save()
 return token
}

const User = mongoose.model('user',userSchema)

module.exports = User

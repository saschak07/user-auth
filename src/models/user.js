const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


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
    user.passwd =  await bcrypt.hash(user.passwd,8)
})

userSchema.statics.findUserByCreds = async (userName,passwd) => {
        const user = await User.findOne({userName})
        if(!user || !await bcrypt.compare(passwd,user.passwd)){
            throw new Error('Credentials not matching!')
        }
        return user
   }

const User = mongoose.model('user',userSchema)

module.exports = User

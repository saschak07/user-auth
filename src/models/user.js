const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Friend = require('./friend')


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
    photo: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('friends',{
    ref: 'friend',
    localField: '_id',
    foreignField: 'source'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.passwd
    delete userObject.tokens
    delete userObject.photo
    return userObject
}

userSchema.pre('save', async function(){
    const user = this
    if(user.isModified('passwd')){
    user.passwd =  await bcrypt.hash(user.passwd,8)
    }
})

userSchema.pre('remove', async function(){
    const user = this
    await Friend.deleteMany({source: user._id})
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
 const token = await jwt.sign({_id: user.userName},process.env.JWT_SECRET)
 user.tokens = user.tokens.concat({token})
 await user.save()
 return token
}

const User = mongoose.model('user',userSchema)

module.exports = User

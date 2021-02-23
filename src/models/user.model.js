const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Order = require('./order.model')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter Name'],
        minlength:[4,'Name is too short!'],
        maxlength:50
      },
    password:{
        type: String,
        trim:true,
        match:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [20, 'Password must be at most 20 characters'],
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Email not valide')
        }
    },
    phone:{
        type:String,
        validate(value){
            if(!validator.isMobilePhone(value, 'ar-EG')) throw new Error('phone must be Egyption number')
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
        min: 10,
        max: 100,
      },
    //   image:{
    //     type:String,
    //     trim:true
    //  },
      role:{
          type:String,
          enum:['Admin', 'delivery', 'user'],
          required: true,
          trim:true
      },
      status:{
        type:Boolean, 
        default:false
    },
    // tokens:[
    //     {
    //         token: { type:String } 
    //     }
    // ]
},{
    timestamps:true
})
//virtual relation
userSchema.virtual('myOrder', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user_id'
})
//handle json data
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.__v
    return user
}
//password encryption
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 13)
    next()
})
//token generation
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWTKEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
//remove order for user
// userSchema.pre('remove', async function(next){
//     const user = this
//     await Order.deleteMany({user_id: user._id})
//     next()
// })
//login
userSchema.statics.findUserByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error('invalid email')
    flag = await bcrypt.compare(password, user.password)
    if(!flag) throw new Error('invalid password')
    return user
}
const User = mongoose.model('User', userSchema)
module.exports =User
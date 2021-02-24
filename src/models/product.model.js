const mongoose = require('mongoose')
const validator = require('validator')
const Order = require('./orders.model')
const productSchema = new mongoose.Schema({
        name:{
            type:String,
            minLength:5,
            maxLength:30,
            required:true,
            trim:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        discount:{
            type:Number,
            validate(value){
                if(value<0) throw new Error('must be positive')
            },
            default:0
        },
        quantity:{
            type:Number,
            validate(value){
                if(value<0) throw new Error('must be positive')
            },
            default:0
        },
        img:{
            type:String,
            trim:true
        },
        category_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'Category'
        },
    },{
        timestamps:true
})
//vitual relation 
orderSchema.virtual('orders',{
    ref: 'Order',
    localField: '_id',
    foreignField: 'items.product_id'
})
const Product = mongoose.model('Product', productSchema)
module.exports = Product
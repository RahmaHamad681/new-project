const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    items:[
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    orderStatus: { 
            type: String,
            enum: ["ordered", "packed", "shipped", "delivered"],
            default: "ordered",
            // isCompleted: {type: Boolean, default: false},
        },
    date: {type: Date},

},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
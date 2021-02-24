const mongoose = require('mongoose')
const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:5,
        maxLength:25
    },
    routes:[
        {
            route:{
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref:'Route'
            }
        }
    ]
},{
    timestamps:true
})

const Role = mongoose.model('Role', roleSchema)
module.exports =Role
const mongoose = require('mongoose')
const routeSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    }
},{
    timestamps:true
})

//virtual relation
routeSchema.virtual('myRole', {
    ref:'Role',
    localField: '_id',
    foreignField:'routes.route'
})

const Route = mongoose.model('Route', routeSchema)
module.exports =Route
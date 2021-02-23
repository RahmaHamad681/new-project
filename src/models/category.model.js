const mongoose = require('mongoose')
const Categories = new mongoose.Schema({
    name:  {type: String},
    subcategories:[{ name : String}]
})
const Category = mongoose.model('Category', Categories)
module.exports = Category
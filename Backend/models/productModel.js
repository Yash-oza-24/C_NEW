const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    brand: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    discountPrice: {type: Number, required: true},
    stock: {type: Number, required: true},
    images: {type: [String], required: true},
    rating: {type: Number, required: true},
    isFeatured: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now}
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product
const mongoose = require('mongoose')
const validator = require('validator')

const rawMaterialSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        index: true,
        default: true
    },

    supplier_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Supplier",
        index: true,
        default: true
    },

    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        default: "Garem"
    },  

    code: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        enum: ["Kilo Gram","Gram", "Dozen", "PCS", "Pack", "Liter"],
        required: true
    },

    valueUnit:{
        type: Number,
        required: true
    },

    qty:{
        type: Number,
        required: true
    },
    
    pricePerUnit: {
        type: Number,
        required: true
    },

    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        index: true
    },

    updated_by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        index: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("RawMaterial", rawMaterialSchema)
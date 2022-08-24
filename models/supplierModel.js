const mongoose = require('mongoose')
const validator = require('validator')

const supplierSchema = new mongoose.Schema({

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

    code: {
        type: Number,
        required: true, 
        unique: true,
    },

    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },

    telp: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },

    address: {
        type: String,
    },

    dueDate: {
        type: Date,
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

module.exports = mongoose.model("Supplier", supplierSchema)
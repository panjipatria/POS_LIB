const mongoose = require('mongoose')
const validator = require('validator')

const categorySchema = new mongoose.Schema({

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
        default: null
    },

    name: {
        type: String,
        required: [true, "Please Enter Category Name"],
        default: "Food"
    },

    parent_id: {
        type: String,
        required: true,
        default: null
    },

    subCategory: [{
        name: {
            type: String
        },
        sub2: [{
            name: {
                type: String
            }
        }]
    }],

    profitSharing: {
        type: Number,
        required:true
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

module.exports = mongoose.model("Category", categorySchema)
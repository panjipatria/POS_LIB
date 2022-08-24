const mongoose = require('mongoose')
const validator = require('validator')

const roleSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id: {
        type: String
    },

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [100, "Name Cannot Exeed 100 Characters"]
    },

    permission: [{
        type: String,
        required: true
    }],

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

module.exports = mongoose.model("Role", roleSchema)
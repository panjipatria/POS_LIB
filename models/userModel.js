const mongoose = require('mongoose')
const validator = require('validator')
const Account = require('./accountModel')

const userSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Branch",
        index: true,
        default: null
    },

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [100, "Name Cannot Exeed 100 Characters"]
    },

    username: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [50, "Name Cannot Exeed 50 Characters"],
        unique: true,
    },

    phone: {
        type: String,
        required: [true, "Please Enter Your Phone Number"],
        minlength: [8, "Name Cannot Exeed 8 Characters"]
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },

    address: {
        type: String,
        maxlength: [255, "Address Cannot Exeed 255 Characters"]
    },

    role_id: [{
        type: mongoose.Schema.ObjectId,
        ref: "Role",
        required: true,
        index: true
    }],

    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("User", userSchema)
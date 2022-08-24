const mongoose = require('mongoose')
const validator = require('validator')
const Account = require('./accountModel')
const User = require('./userModel')
const Role = require('./roleModel')

const branchSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [100, "Name Cannot Exeed 100 Characters"]
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },

    logo: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },

    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    kind: {
        type: String,
        enum: ["A", "B", "C", "other"],
        required: true,
    },

    other: {
        type: String
    },

    expire: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

branchSchema.pre('remove', function(next){
    Account.remove({branch_id: this._id}).exec()
    User.remove({branch_id: this._id}).exec()
    Role.remove({branch_id: this._id}).exec()
    next()
})
module.exports = mongoose.model("Branch", branchSchema)
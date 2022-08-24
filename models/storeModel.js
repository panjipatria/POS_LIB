const mongoose = require('mongoose')
const validator = require('validator')
const Account = require('./accountModel')
const User = require('./userModel')
const Role = require('./roleModel')
const Category = require('./categoryModel')

const storeSchema = new mongoose.Schema({

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

    branch_id: [{
        type: mongoose.Schema.ObjectId,
        ref: "Branch"
    }],

    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    sosmed: [{
        type: String
    }],

    // billing_id: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Billing",
    //     required: true,
    //     index: true
    // },

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

storeSchema.pre('remove', function(next){
    Account.remove({store_id: this._id}).exec()
    User.remove({store_id: this._id}).exec()
    Role.remove({store_id: this._id}).exec()
    Category.remove({store_id: this._id}).exec()
    next()
})
module.exports = mongoose.model("Store", storeSchema)
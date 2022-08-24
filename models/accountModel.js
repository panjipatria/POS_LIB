const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')

const accountSchema = new mongoose.Schema({

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

    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    username: {
        type: String,
        unique: true,
    },

    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },

    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password should be greater than 8 characters"],
        maxlength: [100, "Password Cannot Exeed 100 Characters"],
        select: false
    },

    otp: {
        code: {
            type: String
        },
        expire: {
            type: Date
        }
    },

    verified: {
        type: Boolean,
        required: true,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
})

accountSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token
accountSchema.methods.getJWTToken = async function(){ 
    const user = await User.findById(this.user_id);
    return jwt.sign({ 
        id:this._id,
        store_id: user.store_id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

accountSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

accountSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model("Account", accountSchema)
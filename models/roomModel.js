const mongoose = require('mongoose')
const validator = require('validator')

const ruanganSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: [true, "Please Enter Ruangan Name"],
        default: "VIP"
    },

    floor: {
        type: Number,
        required: [true, "Please Enter Floor"],
        default: 1
    },

    roomType: {
        type: String,
        enum: ["Smoking", "Non Smoking"],
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

module.exports = mongoose.model("Ruangan", ruanganSchema)
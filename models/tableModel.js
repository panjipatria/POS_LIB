const mongoose = require('mongoose')
const validator = require('validator')

const tableSchema = new mongoose.Schema({

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

    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        index: true,
        default: null
    },

    // categoryMeja_id: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "CatgoryMeja",
    //     required: true,
    //     index: true
    // },

    room_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: [true, "Please Enter Ruangan Name"],
        default: "VIP"
    },

    capacity: {
        type: Number,
        required: true
    },

    x: {
        type: Number,
        required: true
    },

    y: {
        type: Number,
        required: true
    },

    // QR: {
    //     type: String,
    //     required: true
    // },

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

module.exports = mongoose.model("Table", tableSchema)
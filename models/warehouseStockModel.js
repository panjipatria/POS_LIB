const mongoose = require('mongoose')
const validator = require('validator')

const warehouseSchema = new mongoose.Schema({

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

    rawMaterial_id: {
        type: mongoose.Schema.ObjectId,
        ref: "RawMaterial",
        required: true,
        index: true
    },

    finishedGoods_id: {
        type: mongoose.Schema.ObjectId,
        ref: "FinishedGoods",
        required: true,
        index: true
    },

    totalGoodsStock:{
        type: Number,
        required: true,
    },

    minimumGoodsStock: {
        type: Number,
        required: true,

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

module.exports = mongoose.model("Warehouse", warehouseSchema)
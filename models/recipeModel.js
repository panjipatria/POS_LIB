const mongoose = require('mongoose')
const validator = require('validator')

const recipeSchema = new mongoose.Schema({

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

    product_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },

    goodsStock_id: {
        type: mongoose.Schema.ObjectId,
        ref: "GoodStock",
        required: true,
        index: true
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

    qty:{
        type: Number,
        required: true,
    },

    hpp: {
        type: Number,
        required: true,
    },

    avgHpp: {
        type: Number,
        required: true,
    },

    totalAvgHpp:{
        type: Number,
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

module.exports = mongoose.model("Recipe", recipeSchema)
const mongoose = require('mongoose')
const validator = require('validator')

const goodsStock = new mongoose.Schema({

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

    rawMaterial: [{
        rawMaterial_id: {
            type: mongoose.Schema.ObjectId,
            ref: "RawMaterial",
            required: true,
            index: true
        },
        name: {
            type: String
        },
        qty: {
            type: Number
        },
        valueUnit:{
            type: Number,
            required: true
        },  
        pricePerUnit: {
            type: Number,
            required: true
        }
      
    }],

    finishedGoods: [{
        finishedGoods_id: {
            type: mongoose.Schema.ObjectId,
            ref: "FinishedGoods",
            required: true,
            index: true
        },
        name: {
            type: String
        },
        qty: {
            type: Number
        },
        valueUnit:{
            type: Number,
            required: true
        },    
        pricePerUnit: {
            type: Number,
            required: true
        }
    
    }],

    // unitPrice: {
    //     type: Number,
    //     required:true
    // },

    // subTotalPrice: {
    //     type: Number,
    //     required:true
    // },

    minimumGoodsStock: {
        type: Number,
        required:true
    },

    totalGoodsStock: {
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

module.exports = mongoose.model("GoodsStock", goodsStock)
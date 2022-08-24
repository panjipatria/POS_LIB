const mongoose = require('mongoose')
const validator = require('validator')
const MinOrder = require('./minOrderProductModel')
const MinTransaction = require('./minTransactionModel')
const BuyAFreeB = require('./buyAFreeBModel')

const autoPromoSchema = new mongoose.Schema({

    store_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Branch",
        index: true
    },

    minimumTransactionDiscount: {
        type: mongoose.Schema.ObjectId,
        ref: "MinOrderProduct",
        index: true
    },

    minimumOrderProductDiscount: {
        type: mongoose.Schema.ObjectId,
        ref: "MinTransaction",
        index: true
    },

    buyAFreeB: {
        type: mongoose.Schema.ObjectId,
        ref: "BuyAFreeB",
        index: true
    },

    type: {
        type: String,
        enum: ["MinOrderProduct", "MinTransaction", "BuyAFreeB"],
        required: true
    },

    status: {
        type: Boolean,
        required: true,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

autoPromoSchema.pre('remove', function(next){
    MinOrder.remove({_id: this.minimumOrderProductDiscount}).exec()
    MinTransaction.remove({_id: this.minimumTransactionDiscount}).exec()
    BuyAFreeB.remove({_id: this.buyAFreeB}).exec()
    next()
})
module.exports = mongoose.model("AutoPromo", autoPromoSchema)
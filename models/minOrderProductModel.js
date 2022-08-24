const mongoose = require('mongoose')
const validator = require('validator')

const minOrderProductSchema = new mongoose.Schema({

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

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [100, "Name Cannot Exeed 100 Characters"]
    },

    filter: {
        type: String,
        enum: ["category", "product"],
        required: true,
        default: "product"
    },

    detailProduct_id: [{
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        index: true
    }],

    detailCategory: [{
        category_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            index: true
        },
        subCategory_id: {
            type: String
        },
        sub2_id: {
            type: String
        }
    }],

    total: {
        type: Number,
        required: true
    },

    totalDiscount: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    activedDays: [{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Everydays"],
        required: true,
        default: "Everydays"
    }],

    appliesMultiply: {
        type: Boolean,
        required: true
    },

    typeDiscount: {
        type: String,
        enum: ["%", "Rp."],
        required: true,
        default: "%"
    },

    location: {
        store: {
            type: mongoose.Schema.ObjectId,
            ref: "Store",
            index: true
        },
        branch: [{
            _branch_id: {
                type: mongoose.Schema.ObjectId,
                ref: "Branch",
                index: true
            }
        }]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("MinOrderProduct", minOrderProductSchema)
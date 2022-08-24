const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({

    store_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },

    branch_id:{
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        index: true,
        default: null
    },

    category: {
        category_id:{
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },
        subCategory_id: {
            type: String
        },
        sub2_id: {
            type: String
        }
    },

    productCode:{
        type: Number,
        required: true
    },

    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        default: "Aqua 1lt"
    },

    price: {
        type: Number,
        required: true,
        default: 0
    },

    priceGojek: {
        type: Number,
        required: true,
        default: 0
    },

    priceGrab: {
        type: Number,
        required: true,
        default: 0
    },

    priceShopee: {
        type: Number,
        required: true,
        default: 0
    },

    image: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },

    video: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },

    descriptions: {
        type: String,
        required: true
    },

    qty: {
        type: Number,
        required: true
    },

    weight: {
        type: Number,
        required: true,
    },

    packageLength: {
        type: Number,
        required: true
    },

    packageWidth: {
        type: Number,
        required: true
    },

    packageHeight: {
        type: Number,
        required: true
    },

    minOrder: {
        type: Number,
        required: true,
        default: true
    },

    preOrder: {
        type: Date,
    },

    condition: {
        type: String,
        required: true
    },

    wholesalePrice: {
        type: Number,
    },

    warantyPriode: {
        type: Date,
        required: true
    },

    warantyPolicy: {
        type: String,
        required: true
    },

    COD: {
        type: Boolean,
        required: true,
        default: false
    },

    SKU: {
        type: String,
        required: true
    },

    dangerousItem: {
        type: Boolean,
        default: false
    },

    variant: [{
        name: {
            type: String
        }
    }],

    // delivery: {
    //     type: String,
    // }

    // integrasi: [{
    //     marketPlaceId: {
    //         type: mongoosee.Schema.ObjectId
    //     },
    //     integratedId: {
    //         type: mongoosee.Schema.ObjectId
    //     }
    // }],
    
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
    },
})


module.exports = mongoose.model("Product", productSchema)

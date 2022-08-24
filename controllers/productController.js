const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")
const mongoose = require('mongoose')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const AutoPromo = require('../models/autoPromoModel')
const MinOrder = require('../models/minOrderProductModel')
const MinTransaction = require('../models/minTransactionModel')
const BuyAFreeB = require('../models/buyAFreeBModel')
const User = require('../models/userModel')


exports.createCategory = catchAsyncErrors(async (req, res, next) => {

const {name, subCategory, profitSharing} = req.body


    const category = await Category.create({
        store_id: req.account.user_id.store_id,
        name,
        subCategory,
        profitSharing,
        created_by: req.account.user_id._id
    })

    res.status(200).json({
        success: true,
        category
    })

})


exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 2
    const categoryCount = await Category.countDocuments()

    const apiFeature = new ApiFeatures(Category.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let categories = await apiFeature.query
    let filteredCategoryCount = categories.length
    apiFeature.pagination(resultPerPage)

    categories = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        categories,
        categoryCount,
        resultPerPage,
        filteredCategoryCount
    })
})

exports.getOneCategory = catchAsyncErrors(async (req, res, next) => {

    const category = await Category.findById(req.params.id)

    if(!category){
        return next(
            new ErrorHandler(`Category with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        category
    })
})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {

    const { name, subName, profitSharing } = req.body

    const category = await Category.findOneAndUpdate({_id: req.params.id}, {
        name,
        subName,
        profitSharing,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!category){
        return next(
            new ErrorHandler("Category not Found")
        )
    }

    res.status(200).json({
        success: true,
        category,
        message: "Category Updated Successfully"
    })
    
})

exports.addFirstSubCategory = catchAsyncErrors(async (req, res, next) => {

    const subCategory = await Category.findOneAndUpdate({_id: req.params.id}, {
        $push: {
            subCategory: req.body.subCategory
        }
    }, {new: true})

    if(!subCategory){
        return next(
            new ErrorHandler("Category not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        subCategory
    })
})

exports.removeFirstSubCategory = catchAsyncErrors(async (req, res, next) => {

    const subCategory = await Category.findOneAndUpdate({_id: req.params.id}, {
        $pull: {
            subCategory: {
                _id: req.body.subCategory_id
            }
        }
    }, {new: true})

    if(!subCategory){
        return next(
            new ErrorHandler("Category not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        subCategory
    })
})

exports.addSecondSubCategory = catchAsyncErrors(async (req, res, next) => {
    
    const subCategory = await Category.findOneAndUpdate({
        _id: req.params.id,
        'subCategory._id': req.body.subCategory_id
    }, {
        $push: {
            'subCategory.$.sub2': req.body.sub2
        }
    }, {new: true})

    if(!subCategory){
        return next(
            new ErrorHandler("Sub Category not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        subCategory
    })
})

exports.removeSecondSubCategory = catchAsyncErrors(async (req, res, next) => {

    const subCategory = await Category.findOneAndUpdate({
        _id: req.params.id,
        'subCategory._id': req.body.subCategory_id
    }, {
        $pull: {
            'subCategory.$.sub2': req.body.sub2
        }
    })

    if(!subCategory){
        return next(
            new ErrorHandler("Sub Category not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        subCategory
    })
})

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id)

    if(!category){
        return next(
            new ErrorHandler("Category does not exist")
        )
    }

    await category.remove()

    res.status(200).json({
        success: true,
        message: "Category Deleted Successfully"
    })
})

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    
    const {
        productCode, 
        name, 
        price,
        priceGojek,
        priceGrab,
        priceShopee,
        descriptions,
        qty,
        weight,
        packageLength,
        packageHeight,
        packageWidth,
        minOrder,
        preOrder,
        condition,
        wholesalePrice,
        warantyPriode,
        warantyPolicy,
        COD,
        SKU,
        dangerous,
        variant,
     } = req.body

     const category = {
        category_id: req.body.category.category_id,
        subCategory_id: (req.body.category.subCategory_id !== '')?req.body.category.subCategory_id:undefined,
        sub2_id: (req.body.category.sub2_id !== '')?req.body.category.sub2_id:undefined
     }

     const product = await Product.create({
        store_id: req.account.user_id.store_id,
        productCode,
        name,
        category,
        price,
        priceGojek,
        priceGrab,
        priceShopee,
        descriptions,
        qty,
        weight,
        packageLength,
        packageHeight,
        packageWidth,
        minOrder,
        preOrder,
        condition,
        wholesalePrice,
        warantyPriode,
        warantyPolicy,
        COD,
        SKU,
        dangerous,
        variant,
        created_by: req.account.user_id._id
     })

     res.status(200).json({
        success: true,
        product
    })
})

exports.getAllProduct =  catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
        .search()
        .filter()

    let products = await apiFeature.query
    let filteredProductCount = products.length
    apiFeature.pagination(resultPerPage)

    products = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductCount
    })

})

exports.getOneProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if(!product){
        return next(
            new ErrorHandler(`Product with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        product
    })
})

exports.updateProduct = catchAsyncErrors(async(req, res, next)=>{

    const {
        productCode, 
        name, 
        category_id,
        price,
        priceGojek,
        priceGrab,
        priceShopee,
        descriptions,
        qty,
        weight,
        packageLength,
        packageHeight,
        packageWidth,
        minOrder,
        preOrder,
        condition,
        wholesalePrice,
        warantyPriode,
        warantyPolicy,
        COD,
        SKU,
        dangerous,
        variant,
     } = req.body

     const product = await Product.findByIdAndUpdate(req.params.id, {
        productCode, 
        name, 
        category_id,
        price,
        priceGojek,
        priceGrab,
        priceShopee,
        descriptions,
        qty,
        weight,
        packageLength,
        packageHeight,
        packageWidth,
        minOrder,
        preOrder,
        condition,
        wholesalePrice,
        warantyPriode,
        warantyPolicy,
        COD,
        SKU,
        dangerous,
        variant,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!product){
        return next(
            new ErrorHandler("Category not Found",404)
        )
    }

     res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async (res, req, next)=> {

    const product = await Product.findById(req.params.id)

    if(!product){
        return next(
            new ErrorHandler("Product does not exist")
        )
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })

})

exports.createAutoPromo = catchAsyncErrors(async (req, res, next) => {

    const {
        name,
        minimumTransaction,
        filter,
        detailProduct_id,
        detailProductFree_id,
        total,
        totalDiscount,
        totalFree,
        activedDays,
        appliesMultiply,
        typeDiscount,
        type,
        startDate,
        endDate,
        startTime,
        endTime,
        location
    } = req.body

    const session = await mongoose.startSession()
    await session.startTransaction()

    try {

        let data = []    
        if(type === 'MinOrderProduct'){
            
            if(filter === 'category'){
                if(req.body.detailCategory.length < 1){
                    return next(
                        new ErrorHandler("Detail Category is required")
                    )
                }
            } else {
                if(req.body.detailCategory.length < 1){
                    return next(
                        new ErrorHandler("Detail Product is required")
                    )
                }
            }
        
            let detailCategory = []
            for(i=0; i<req.body.detailCategory.length; i++){
                await detailCategory.push({
                    category_id: req.body.detailCategory[i].category_id,
                    subCategory_id: (req.body.detailCategory[i].subCategory_id !== '')?req.body.detailCategory[i].subCategory_id:undefined,
                    sub2_id: (req.body.detailCategory[i].sub2_id !== '')?req.body.detailCategory[i].sub2_id:undefined
                })
            }

            const minOrder = await MinOrder.create([{
                store_id: req.account.user_id.store_id,
                branch_id: (req.account.user_id.branch_id !== undefined)?req.account.user_id.branch_id:null,
                name,
                filter,
                detailProduct_id,
                detailCategory,
                total,
                totalDiscount,
                startDate: `${startDate}T00:00:00.000Z`,
                endDate: `${endDate}T00:00:00.000Z`,
                startTime: `1970-01-01T${startTime}.000Z`,
                endTime: `1970-01-01T${endTime}.000Z`,
                activedDays,
                appliesMultiply: (typeDiscount !== "%")?appliesMultiply:false,
                typeDiscount,
                location
            }], {session})
            await data.push(minOrder[0])
        } else if(type === 'MinTransaction'){
            const minTransaction = await MinTransaction.create([{
                store_id: req.account.user_id.store_id,
                branch_id: (req.account.user_id.branch_id !== undefined)?req.account.user_id.branch_id:null,
                name,
                minimumTransaction,
                totalDiscount,
                startDate: `${startDate}T00:00:00.000Z`,
                endDate: `${endDate}T00:00:00.000Z`,
                startTime: `1970-01-01T${startTime}.000Z`,
                endTime: `1970-01-01T${endTime}.000Z`,
                activedDays,
                appliesMultiply,
                location
            }], {session})
            await data.push(minTransaction[0])
        } else {
            
            if(filter === 'category'){
                if(req.body.detailCategory.length < 1){
                    return next(
                        new ErrorHandler("Detail Category is required")
                    )
                }
            } else {
                if(req.body.detailCategory.length < 1){
                    return next(
                        new ErrorHandler("Detail Product is required")
                    )
                }
            }
        
            let detailCategory = []
            for(i=0; i<req.body.detailCategory.length; i++){
                await detailCategory.push({
                    category_id: req.body.detailCategory[i].category_id,
                    subCategory_id: (req.body.detailCategory[i].subCategory_id !== '')?req.body.detailCategory[i].subCategory_id:undefined,
                    sub2_id: (req.body.detailCategory[i].sub2_id !== '')?req.body.detailCategory[i].sub2_id:undefined
                })
            }

            const buyAFreeB = await BuyAFreeB.create([{
                store_id: req.account.user_id.store_id,
                branch_id: (req.account.user_id.branch_id !== undefined)?req.account.user_id.branch_id:null,
                name,
                filter,
                detailProduct_id,
                detailCategory,
                total,
                totalFree,
                detailProductFree_id,
                startDate: `${startDate}T00:00:00.000Z`,
                endDate: `${endDate}T00:00:00.000Z`,
                startTime: `1970-01-01T${startTime}.000Z`,
                endTime: `1970-01-01T${endTime}.000Z`,
                activedDays,
                appliesMultiply,
                location
            }], {session})
            await data.push(buyAFreeB[0])
        }

        const autoPromo = await AutoPromo.create([{
            store_id: req.account.user_id.store_id,
            minimumTransactionDiscount: (type === 'MinTransaction')?data[0]._id:null,
            minimumOrderProductDiscount: (type === 'MinOrderProduct')?data[0]._id:null,
            buyAFreeB: (type === 'BuyAFreeB')?data[0]._id:null,
            type,
        }], {session})

        await session.commitTransaction()
        
        res.status(200).json({
            success: true,
            data,
            autoPromo
        })
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})

exports.getAllAutoPromo = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 2
    const autoPromoCount = await AutoPromo.countDocuments()

    const apiFeature = new ApiFeatures(AutoPromo.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let autoPromo = await apiFeature.query
    let filteredAutoPromoCount = autoPromo.length
    apiFeature.pagination(resultPerPage)

    autoPromo = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        autoPromo,
        autoPromoCount,
        resultPerPage,
        filteredAutoPromoCount
    })
})

exports.getOneAutoPromo = catchAsyncErrors(async (req, res, next) => {

    const autoPromo = await AutoPromo.findOne({_id: req.params.id})

    if(!autoPromo){
        return next(
            new ErrorHandler("Auto Promo not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        autoPromo
    })
})

exports.updateAutoPromo = catchAsyncErrors(async (req, res, next) => {

    const {
        name,
        minimumTransaction,
        filter,
        detailProduct_id,
        detailProductFree_id,
        total,
        totalDiscount,
        totalFree,
        activedDays,
        appliesMultiply,
        typeDiscount,
        type,
        startDate,
        endDate,
        startTime,
        endTime,
        location
    } = req.body

    const autoPromo = await AutoPromo.findOne({_id: req.params.id})

    const session = await mongoose.startSession()
    await session.startTransaction()

    try {
        
        let updateData = []
        let removeData = []
        if(!autoPromo){
            return next(
                new ErrorHandler("Auto Promo not Founded", 404)
            )
        } else if(autoPromo.minimumTransactionDiscount !== null){
            console.log('anjing')
        } else if(autoPromo.minimumOrderProductDiscount !== null){

            if(filter === 'category'){
                const _minOrder = await MinOrder.findOne({_id: autoPromo.minimumOrderProductDiscount})

                if(_minOrder.detailProduct_id.length > 0){
                    for(i=0; i<_minOrder.detailProduct_id.length; i++){
                        const removedData = await MinOrder.findOneAndUpdate({_id: autoPromo.minimumOrderProductDiscount}, {
                            $pull: {
                                detailProduct_id: _minOrder.detailProduct_id[i]
                            }
                        }, {
                            session,
                            new: true
                        })
                        await removeData.push(_minOrder.detailProduct_id[i])
                    }
                } 

                let detailCategory = []
                for(i=0; i<req.body.detailCategory.length; i++){
                    await detailCategory.push({
                        category_id: req.body.detailCategory[i].category_id,
                        subCategory_id: (req.body.detailCategory[i].subCategory_id !== '')?req.body.detailCategory[i].subCategory_id:undefined,
                        sub2_id: (req.body.detailCategory[i].sub2_id !== '')?req.body.detailCategory[i].sub2_id:undefined
                    })
                }

                const minOrder = await MinOrder.findOneAndUpdate({_id: autoPromo.minimumOrderProductDiscount}, {
                    name,
                    filter,
                    detailCategory,
                    total,
                    totalDiscount,
                    startDate: `${startDate}T00:00:00.000Z`,
                    endDate: `${endDate}T00:00:00.000Z`,
                    startTime: `1970-01-01T${startTime}.000Z`,
                    endTime: `1970-01-01T${endTime}.000Z`,
                    activedDays,
                    appliesMultiply: (typeDiscount !== "%")?appliesMultiply:false,
                    typeDiscount,
                    location
                }, {
                    session,
                    new: true
                })
                await updateData.push(minOrder)
                console.log(minOrder)
            } else {
                if(req.body.detailCategory.length < 1){
                    return next(
                        new ErrorHandler("Detail Product is required")
                    )
                }
            }
        } else if(autoPromo.buyAFreeB !== null){
            console.log('babi')
        }
    
        return
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})
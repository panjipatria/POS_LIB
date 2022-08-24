const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")
const RawMaterial = require("../models/rawMaterialModel")
const FinishedGoods = require("../models/finishedGoodsModel")
const Supplier = require("../models/supplierModel")
const Stock = require("../models/goodsStockModel")
const Recipe = require("../models/recipeModel")

exports.createRawMaterial = catchAsyncErrors(async(req, res, next) => {

    const {name, code, unit, valueUnit, qty, pricePerUnit, supplier_id, branch_id} = req.body

    const countUnit = Math.abs(pricePerUnit / valueUnit * qty)
    const countPerunit = Math.abs(pricePerUnit / valueUnit)

    const material = await RawMaterial.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        supplier_id,
        name, 
        code,
        unit,
        valueUnit,
        qty,
        pricePerUnit,
        unitPrice: countPerunit,
        subTotalPrice: countUnit,
        created_by: req.account.user_id._id
    })

    res.status(200).json({
        success: true,
        material
    })

})

exports.getAllRawMaterial = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const materialCount = await RawMaterial.countDocuments()

    const apiFeature = new ApiFeatures(RawMaterial.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let material = await apiFeature.query
    let filteredMaterialCount = material.length
    apiFeature.pagination(resultPerPage)

    material = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        material,
        materialCount,
        resultPerPage,
        filteredMaterialCount
    })
})

exports.getOneRawMaterial = catchAsyncErrors(async(req, res, next) => {

    const material = await RawMaterial.findById(req.params.id)

    if(!material){
        return next(
            new ErrorHandler(`RawMaterial with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        material
    })
})

exports.updateRawMaterial = catchAsyncErrors(async(req, res, next) => {

    const {name, code, unit, pricePerUnit} = req.body

    const material = await RawMaterial.findOneAndUpdate({_id: req.params.id}, {
        name,
        code,
        unit,
        pricePerUnit,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!material){
        return next(
            new ErrorHandler(`Raw Material id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        material
    })
})

exports.deleteRawMaterial = catchAsyncErrors(async(req, res, next) => {
    
    const material = await RawMaterial.findById(req.params.id)

    if(!material){
        return next(
            new ErrorHandler("Raw Material does not exist")
        )
    }

    await material.remove()

    res.status(200).json({
        success: true,
        message: "Raw Material Deleted Successfully"
    })
})

exports.createFinishedGoods = catchAsyncErrors(async(req, res, next) => {

    const {name, code, unit, valueUnit, qty, pricePerUnit, supplier_id, branch_id} = req.body

    const countUnit = Math.abs(pricePerUnit / valueUnit * qty)
    const countPerunit = Math.abs(pricePerUnit / valueUnit)

    const finished = await FinishedGoods.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        supplier_id,
        name, 
        code,
        unit,
        valueUnit,
        qty,
        pricePerUnit,
        unitPrice: countPerunit,
        subTotalPrice: countUnit,
        created_by: req.account.user_id._id      
    })

    res.status(200).json({
        success: true,
        finished
    })
})

exports.getAllFinishedGoods = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const finishedCount = await FinishedGoods.countDocuments()

    const apiFeature = new ApiFeatures(FinishedGoods.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let finished = await apiFeature.query
    let filteredFinishedCount = finished.length
    apiFeature.pagination(resultPerPage)

    finished = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        finished,
        finishedCount,
        resultPerPage,
        filteredFinishedCount
    })
})

exports.getOneFinishedGoods = catchAsyncErrors(async(req, res, next) => {

    const finished = await FinishedGoods.findById(req.params.id)

    if(!finished){
        return next(
            new ErrorHandler(`Finished Material with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        finished
    })
})

exports.updateFinishedGoods = catchAsyncErrors(async(req, res, next) => {

    const {name, code, unit, pricePerUnit} = req.body

    const finished = await FinishedGoods.findOneAndUpdate({_id: req.params.id}, {
        name,
        code,
        unit,
        pricePerUnit,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!finished){
        return next(
            new ErrorHandler(`Raw Material id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        finished
    })
})

exports.deleteFinishedGoods = catchAsyncErrors(async(req, res, next) => {

    const finished = await Finished.findById(req.params.id)

    if(!finished){
        return next(
            new ErrorHandler("Finished Goods does not exist")
        )
    }

    await finished.remove()

    res.status(200).json({
        success: true,
        message: "Finished Goods Deleted Successfully"
    })    
})

exports.createSupplier = catchAsyncErrors(async(req, res, next) => {

    const {code, name, telp, email, address, dueDate, branch_id} = req.body

    const supplier = await Supplier.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        code,
        name,
        telp,
        email, 
        address, 
        dueDate: `${dueDate}T00:00:00.000Z`,
        created_by: req.account.user_id._id        
    })

    res.status(200).json({
        success: true,
        supplier
    })
})

exports.getAllSupplier = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const supplierCount = await Supplier.countDocuments()

    const apiFeature = new ApiFeatures(FinishedGoods.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let supplier = await apiFeature.query
    let filteredSupplierCount = supplier.length
    apiFeature.pagination(resultPerPage)

    supplier = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        supplier,
        supplierCount,
        resultPerPage,
        filteredSupplierCount
    })  
})

exports.getOneSupplier = catchAsyncErrors(async(req, res, next) => {

    const supplier = await Supplier.findById(req.params.id)

    if(!supplier){
        return next(
            new ErrorHandler(`Supplier with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        supplier
    })
})

exports.updateSupplier = catchAsyncErrors(async(req, res, next) => {

    const {code, name, telp, email, address, dueDate} = req.body

    const Supplier = await Supplier.findOneAndUpdate({_id: req.params.id}, {
        code,
        name,
        telp,
        email,
        address,
        dueDate,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!finished){
        return next(
            new ErrorHandler(`Raw Material id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        finished
    })
}) 

exports.deleteSupplier = catchAsyncErrors(async(req, res, next) => {

    const supplier = await Supplier.findById(req.params.id)

    if(!supplier){
        return next(
            new ErrorHandler("Supplier does not exist")
        )
    }

    await supplier.remove()

    res.status(200).json({
        success: true,
        message: "Supplier Deleted Successfully"
    })     
})

exports.createGoodsStock = catchAsyncErrors(async(req, res, next) => {

    const {rawMaterial, finishedGoods, minimumGoodsStock, branch_id} = req.body

    let _rawMaterial = []
    for (let i=0; i<rawMaterial.length; i++) {
        const materialUnit = await RawMaterial.findOne({_id: rawMaterial[i].rawMaterial_id})
        // console.log(materialUnit);
        await _rawMaterial.push({
            rawMaterial_id: materialUnit._id,
            name: materialUnit.name,
            valueUnit: materialUnit.valueUnit,
            qty: materialUnit.qty,
            pricePerUnit: materialUnit.pricePerUnit,
            countSubPrice: materialUnit.pricePerUnit / materialUnit.valueUnit * materialUnit.qty,
            countPerUnit: materialUnit.pricePerUnit / materialUnit.valueUnit
        })
    }

    let _finishedGoods = []
    for (let i=0; i<finishedGoods.length; i++) {
        const finishedUnit = await FinishedGoods.findOne({_id: finishedGoods[i].finishedGoods_id})
        await _finishedGoods.push({
            finishedGoods_id: finishedUnit._id,
            name: finishedUnit.name,
            valueUnit: finishedUnit.valueUnit,
            qty: finishedUnit.qty,
            pricePerUnit: finishedUnit.pricePerUnit,
            countSubPrice: finishedUnit.pricePerUnit / finishedUnit.valueUnit * finishedUnit.qty,
            countPerUnit: finishedUnit.pricePerUnit / finishedUnit.valueUnit
        })
    }

    const countStock = Math.abs(_rawMaterial.length + _finishedGoods.length)

    const goods = await Stock.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        rawMaterial: _rawMaterial,
        finishedGoods: _finishedGoods,
        minimumGoodsStock,
        totalGoodsStock: countStock,
        created_by: req.account.user_id._id    
    })

    res.status(200).json({
        success: true,
        goods
    })
})

exports.getAllGoodsStock = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const goodsCount = await Stock.countDocuments()

    const apiFeature = new ApiFeatures(Stock.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let goods = await apiFeature.query
    let filteredGoodsCount = goods.length
    apiFeature.pagination(resultPerPage)

    goods = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        goods,
        goodsCount,
        resultPerPage,
        filteredGoodsCount
    })
})

exports.getOneGoodsStock = catchAsyncErrors(async(req, res, next) => {

    const goods = await Stock.findById(req.params.id)

    if(!goods){
        return next(
            new ErrorHandler(`Goods Stock with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        goods
    })
})

exports.updateGoodsStock = catchAsyncErrors(async(req, res, next) => {

    const {rawMaterial, finishedGoods} = req.body

    const goods = await Stock.findOneAndUpdate({_id: req.params.id}, {
        rawMaterial,
        finishedGoods,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!goods){
        return next(
            new ErrorHandler(`Goods Stock id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        goods
    })
})

exports.deleteGoodsStock = catchAsyncErrors(async(req, res, next) => {

    const goods = await Stock.findById(req.params.id)

    if(!goods){
        return next(
            new ErrorHandler("Goods Stock does not exist")
        )
    }

    await goods.remove()

    res.status(200).json({
        success: true,
        message: "Goods Stock Deleted Successfully"
    }) 
})

exports.createRecipe = catchAsyncErrors(async(req, res, next) => {

    const { product_id, goodsStock_id, rawMaterial_id, finishedGoods_id, qty, avgHpp, totalAvgHpp, branch_id } = req.body


    // const stock = await Stock.findOne(goodsStock_id.goodsStock_id)
    const stock = await RawMaterial.findOne(rawMaterial_id.rawMaterial_id)
    
    console.log(stock)
    return
    const recipe = await Recipe.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        product_id,
        goodsStock_id,
        qty,
        avgHpp,
        totalAvgHpp,
        created_by: req.account.user_id._id    
    })

    res.status(200).json({
        success: true,
        recipe
    })
})

exports.getAllRecipe = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const recipeCount = await Stock.countDocuments()

    const apiFeature = new ApiFeatures(Stock.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let recipe = await apiFeature.query
    let filteredRecipeCount = recipe.length
    apiFeature.pagination(resultPerPage)

    recipe = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        recipe,
        recipeCount,
        resultPerPage,
        filteredRecipeCount
    })    
})

exports.getOneRecipe = catchAsyncErrors(async(req, res, next) => { 

    const recipe = await Recipe.findById(req.params.id)

    if(!recipe){
        return next(
            new ErrorHandler(`Recipe with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        recipe
    })    
})

exports.updateRecipe = catchAsyncErrors(async(req, res, next) => {

    const { product_id, goodsStock_id, qty, avgHpp, totalAvgHpp } = req.body

    const recipe = await Recipe.findOneAndUpdate({_id: req.params.id}, {
        product_id,
        goodsStock_id,
        qty,
        avgHpp,
        totalAvgHpp,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!recipe){
        return next(
            new ErrorHandler(`Recipe Stock id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        recipe
    })    
})

exports.deleteRecipe = catchAsyncErrors(async(req, res, next) => {

    const recipe = await Recipe.findById(req.params.id)

    if(!recipe){
        return next(
            new ErrorHandler("Recipe does not exist")
        )
    }

    await recipe.remove()

    res.status(200).json({
        success: true,
        message: "Recipe Deleted Successfully"
    }) 
})


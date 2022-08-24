const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")
const Warehouse = require("../models/warehouseStockModel")

exports.createGoodsStockWarehouse = catchAsyncErrors(async(req, res, next) => {

    const {finishedGoods_id, rawMaterial_id, totalGoodsStock, minimumGoodsStock, branch_id} = req.body

    const warehouse = await Warehouse.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        finishedGoods_id, 
        rawMaterial_id, 
        totalGoodsStock, 
        minimumGoodsStock,
        created_by: req.account.user_id._id        
    })

    res.status(200).json({
        success: true,
        warehouse
    })
    
})

exports.getAllGoodsStockWarehouse = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const warehouseCount = await Warehouse.countDocuments()

    const apiFeature = new ApiFeatures(Warehouse.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let warehouse = await apiFeature.query
    let filteredWarehouseCount = warehouse.length
    apiFeature.pagination(resultPerPage)

    warehouse = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        warehouse,
        warehouseCount,
        resultPerPage,
        filteredWarehouseCount
    })
})

exports.getOneGoodsStockWarehouse = catchAsyncErrors(async(req, res, next) => {

    const warehouse = await Warehouse.findById(req.params.id)

    if(!warehouse){
        return next(
            new ErrorHandler(`Warehouse Material with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        warehouse
    })
})

exports.updateGoodsStockWarehouse = catchAsyncErrors(async(req, res, next) => {

    const {finishedGoods_id, rawMaterial_id, totalGoodsStock, minimumGoodsStock} = req.body

    const warehouse = await Warehouse.findOneAndUpdate({_id: req.params.id}, {
        finishedGoods_id, 
        rawMaterial_id, 
        totalGoodsStock, 
        minimumGoodsStock,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!warehouse){
        return next(
            new ErrorHandler(`Warehouse Stock id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        warehouse
    })
})

exports.deleteGoodsStockWarehouse = catchAsyncErrors(async(req, res, next) => {

    const warehouse = await Warehouse.findById(req.params.id)

    if(!warehouse){
        return next(
            new ErrorHandler("Warehouse Goods does not exist")
        )
    }

    await warehouse.remove()

    res.status(200).json({
        success: true,
        message: "Warehouse Goods Deleted Successfully"
    })  
})

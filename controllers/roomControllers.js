const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")
const Room = require("../models/roomModel")
const Table = require("../models/tableModel")

exports.createRoom = catchAsyncErrors(async(req, res, next) => {

    const { name, floor, roomType, branch_id} = req.body

    const room = await Room.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        name,
        floor,
        roomType,
        created_by: req.account.user_id._id
    })

    res.status(200).json({
        success: true,
        room
    })
})

exports.getAllRoom = catchAsyncErrors(async(req, res, next) => {

    const resultPerPage = 2
    const roomCount = await Room.countDocuments()
    
    const apiFeature = new ApiFeatures(Room.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let rooms = await apiFeature.query
    let filteredRoomCount = rooms.length
    apiFeature.pagination(resultPerPage)

    rooms = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        rooms,
        roomCount,
        resultPerPage,
        filteredRoomCount
    })
})

exports.getOneRoom = catchAsyncErrors(async(req, res, next) => {

    const room = await Room.findById(req.params.id)

    if(!room){
        return next(
            new ErrorHandler(`Room with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        room
    })
})

exports.updateRoom = catchAsyncErrors(async(req, res, next)=>{

    const {name, floor, roomType} = req.body

    const room = await Room.findOneAndUpdate({_id: req.params.id}, {
        name,
        floor,
        roomType,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!room){
        return next(
            new ErrorHandler(`Room id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        room
    })
}),

exports.deleteRoom = catchAsyncErrors(async(req, res, next) => {

    const room = await Room.findById(req.params.id)

    if(!room){
        return next(
            new ErrorHandler("Room does not exist")
        )
    }

    await room.remove()

    res.status(200).json({
        success: true,
        message: "Room Deleted Successfully"
    })
})

exports.createTable = catchAsyncErrors(async(req, res, next)=>{

    const {name,capacity, x, y, room_id, branch_id } = req.body
    const table = await Table.create({
        store_id: req.account.user_id.store_id,
        branch_id,
        name,
        capacity,
        x,
        y,
        room_id,
        // QR
    })

    res.status(200).json({
        success: true,
        table
    })
})

exports.getAllTable = catchAsyncErrors(async(req, res, next) => {

  
    const resultPerPage = 2
    const tableCount = await Table.countDocuments()

    const apiFeature = new ApiFeatures(Table.find()
        .where((req.account.user_id.branch_id !== undefined)?("branch_id", req.account.user_id.branch_id):("store_id", req.store._id)), req.query)
            .search()
            .filter()

    let tables = await apiFeature.query
    let filteredTableCount = tables.length
    apiFeature.pagination(resultPerPage)

    tables = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        tables,
        tableCount,
        resultPerPage,
        filteredTableCount
    })
})

exports.getOneTable = catchAsyncErrors(async(req, res, next) =>{

    const table = await Table.findById(req.params.id)

    if(!table){
        return next(
            new ErrorHandler(`Table with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        table
    })
})

exports.updateTable = catchAsyncErrors(async(req, res, next) =>{

    const {name, capacity, x, y, room_id} = req.body

    const table = await Table.findOneAndUpdate({_id: req.params.id}, {
        name,
        capacity,
        x,
        y,
        room_id,
        updated_by: req.account.user_id._id
    }, {
        new: true,
        runValidators: true
    })

    if(!table){
        return next(
            new ErrorHandler(`Table id : ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        table
    })
})

exports.deleteTable = catchAsyncErrors(async(req, res, next) => {
    
    const table = await Table.findById(req.params.id)

    if(!table){
        return next(
            new ErrorHandler("Table does not exist")
        )
    }

    await table.remove()

    res.status(200).json({
        success: true,
        message: "Table Deleted Successfully"
    })
})
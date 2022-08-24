const Role = require("../models/roleModel")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorHandler")
const ApiFeatures = require("../utils/apiFeatures")

exports.createRole = catchAsyncErrors(async (req, res, next) => {

    const { name, permission } = req.body
    const role = await Role.create({
        store_id: req.store_id._id,
        name,
        permission,
        created_by: req.account.user_id._id
    })

    res.status(200).json({
        success: true,
        role
    })

})

exports.getAllRole = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 2
    const rolesCount = await Role.countDocuments()

    const apiFeature = new ApiFeatures(Role.find().where("store_id", req.store_id._id), req.query)
        .search()
        .filter()

    let roles = await apiFeature.query
    let filteredRolesCount = roles.length
    apiFeature.pagination(resultPerPage)

    roles = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        roles,
        rolesCount,
        resultPerPage,
        filteredRolesCount
    })
})

exports.getOneRole = catchAsyncErrors(async (req, res, next) => {

    const role = await Role.findOne({_id: req.params.id})

    if(!role){
        return next(
            new ErrorHandler("Role not Founded")
        )
    }

    res.status(200).json({
        success: true,
        role
    })
})

exports.deleteRole = catchAsyncErrors (async (req, res, next) => {

    const role = await Role.findById(req.params.id)

    if(!role){
        return next(
            new ErrorHandler("Role not Founded", 404)
        )
    }

    await role.remove()

    res.status(200).json({
        success: true,
        message: "Role Deleted Successfully!"
    })

})

exports.addPermission = catchAsyncErrors(async (req, res, next) => {
  
    const role = await Role.findOneAndUpdate({_id: req.params.id}, {
        $push: {
            permission: req.body.permission
        }
    }, {new: true})

    if(!role){
        return next(
            new ErrorHandler("Role not found", 404)
        )
    }

    res.status(200).json({
        success: true,
        role,
        message: `${req.body.permission} Added to Permission Successfully`
    })
})

exports.deletePermission = catchAsyncErrors(async (req, res, next) => {
  
    const role = await Role.findOneAndUpdate({_id: req.params.id}, {
        $pull: {
            permission: req.body.permission
        }
    }, {new: true})

    if(!role){
        return next(
            new ErrorHandler("Permission not found", 404)
        )
    }

    res.status(200).json({
        success: true,
        role,
        message: `${req.body.permission} Permission Deleted Succsessfully`
    })
})
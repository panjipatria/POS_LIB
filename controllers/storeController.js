const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Store = require("../models/storeModel")
const Branch = require("../models/branchModel")
const Account = require("../models/accountModel")
const User = require("../models/userModel")
const Role = require("../models/roleModel")
const sendTokenMessage = require("../utils/jwtTokenMessage")
const sendOtp = require("../utils/otp")
const cloudinary = require("cloudinary")
const ApiFeatures = require("../utils/apiFeatures")
const mongoose = require('mongoose')

exports.createStore = catchAsyncErrors(async (req, res, next) => {
    let myCloud

    if(req.files?.logo){
        myCloud = await cloudinary.v2.uploader.upload(req.files.logo, {
            folder: "pos/store/logo",
            width: 150,
            crop: "scale"
        }, (function (err){
            throw err
        }))
    }

    if(req.files?.avatar){
        myCloud = await cloudinary.v2.uploader.upload(req.files.avatar, {
            folder: "pos/user/avatar",
            width: 150,
            crop: "scale"
        }, (function (err){
            throw err
        }))
    }

    const session = await mongoose.startSession()
    await session.startTransaction()
    
    const {
        storeName,
        storeEmail,
        storeAddress,
        storePhone,
        storeSosmed,
        storeKind,
        storeOther,
        name,
        username,
        email,
        phone,
        address,
        password
    } = req.body
    
    try {

        var expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + 7)
        var _expireDate = expireDate.toDateString()

        if(storeKind === 'other'){
            if(storeOther === ''){
                return next(
                    new ErrorHandler("Other is required")
                )
            }
        }

        const store = await Store.create([{
            name: storeName,
            email: storeEmail,
            logo: {
                public_id: myCloud?.public_id || null,
                url: myCloud?.secure_url || null
            },
            address: storeAddress,
            sosmed: storeSosmed,
            phone: storePhone,
            kind: storeKind,
            other: storeOther,
            expire: _expireDate
        }], { session })

        const role = await Role.create([{
            store_id: store[0]._id,
            name: "Owner",
            permission: [
                "registerUser",
                "logout",
                "loginUser",
                "getUserDetails",
                "getAllUser",
                "updateProfile",
                "updatePassword",
                "forgotPassword",
                "resetPassword",
                "deleteUser",
                "getSingleUser",
                "verifyUser",
                "resendOtpUser",
                "createUser",
                "deleteUserAccount"
            ],
        }], {session})
    
        const user = await User.create([{
            store_id: store[0]._id,
            name,
            username,
            phone,
            email,
            address,  
            role_id: role[0]._id,
            avatar: {
                public_id: myCloud?.public_id || null,
                url: myCloud?.secure_url || null
            },      
        }], {session})

        const account = await Account.create([{
            store_id: store[0]._id,
            user_id: user[0]._id,
            username: user[0].username,
            email: user[0].email,
            updated: user[0].email,
            password
        }], {session})

        // console.log(account)
        // return

        await session.commitTransaction()

        try {
            await sendOtp(user[0].email, account[0]._id)
            sendTokenMessage(
                account[0],
                200,
                res,
                `Your OTP Code Sent to ${user[0].email}`,
                {
                    account: account[0],
                    store,
                    role,
                    user,
                }
            )
        } catch(e){
            return next(new ErrorHandler(e.message))
        }
        

    }
    catch(err){
        await session.abortTransaction()
        throw err
    }
    finally {
        await session.endSession()
    }
})

exports.getAllStore = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 2
    const storeCount = await Store.countDocuments()

    const apiFeature = new ApiFeatures(Store.find()
        .where("store_id", req.store._id), req.query)
            .search()
            .filter()

    let store = await apiFeature.query
    let filteredStoreCount = store.length
    apiFeature.pagination(resultPerPage)

    store = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        store,
        storeCount,
        resultPerPage,
        filteredStoreCount
    })
})

exports.getOneStore = catchAsyncErrors(async (req, res, next) => {

    const store = await Store.findById(req.params.id)

    if(!store){
        return next(
            new ErrorHandler("Store not Founded", 404)
        )
    }

    res.status(200).json({
        success: true,
        store
    })
})

exports.updateStore = catchAsyncErrors(async (req, res, next) => {
    
    const newStoreData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
    }

    const session = await mongoose.startSession()
    await session.startTransaction()

    let myCloud
    const stores = await Store.findById(req.account.user_id.store_id)
    const logo = stores.logo.public_id

    try {
        if(req.files?.logo){
            await cloudinary.v2.uploader.destroy(logo)

            myCloud = await cloudinary.v2.uploader.upload(req.files.logo, {
                folder: "pos/store/logo",
                width: 150,
                crop: "scale"
            }, (function (err){
                throw err
            }))

            newStoreData.logo = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        await Store.findByIdAndUpdate(req.params.id, newStoreData, {
            session,
            new: true,
            runValidators: true,
            userFindAndModify: true
        })

        await session.commitTransaction()

        res.status(200).json({
            success: true,
            newStoreData
        })
    } catch (err) {
        if(myCloud?.public_id){
            await cloudinary.v2.uploader.destroy(myCloud.public_id)
        }

        await session.abortTransaction()
        throw err
    } finally {
        if(logo && req.files?.logo){
            await cloudinary.v2.uploader.destroy(logo)
        }

        await session.endSession()
    }
})

exports.deleteStore = catchAsyncErrors(async (req, res, next) => {
    
    const store = await Store.findById(req.params.id)

    if(!store){
        return next(
            new ErrorHandler("Store not Founded", 404)
        )
    }

    await store.remove()

    res.status(200).json({
        success: true,
        message: "Store Deleted Successfully"
    })
})

exports.addStoreSosmed = catchAsyncErrors(async (req, res, next) => {
    
    const store = await Store.findOneAndUpdate({_id: req.params.id}, {
        $push: {
            sosmed: req.body.sosmed
        }
    }, {new: true})

    res.status(200).json({
        success: true,
        store
    })
})

exports.removeStoreSosmed = catchAsyncErrors(async (req, res, next) => {

    const store = await Store.findOneAndUpdate({_id: req.params.id}, {
        $pull: {
            sosmed: {
                $in: req.body.sosmed
            }
        }
    }, {new: true})

    if(!store){
        return next(
            new ErrorHandler("Sosmed not found", 404)
        )
    }

    res.status(200).json({
        success: true,
        store,
        message: `${req.body.sosmed} Sosmed Deleted Succsessfully`
    })
})

exports.addBranch = catchAsyncErrors(async (req, res, next) => {
    
    let myCloud

    if(req.files?.avatar){
        myCloud = await cloudinary.v2.uploader.upload(req.files.avatar, {
            folder: "pos/user/avatar",
            width: 150,
            crop: "scale"
        }, (function (err){
            throw err
        }))
    }

    const {
        branchName,
        branchPhone,
        branchEmail,
        branchAddress,
        branchKind,
        branchOther,
        name,
        username,
        phone,
        email,
        address,
        permission,
        password
    } = req.body

    if(branchKind === 'other'){
        if(branchOther === ''){
            return next(
                new ErrorHandler("Branch Other is required")
            )
        }
    }

    const session = await mongoose.startSession()
    await session.startTransaction()

    try {
        
        const branch = await Branch.create([{
            store_id: req.account.user_id.store_id,
            name: branchName,
            phone: branchPhone,
            email: branchEmail,
            address: branchAddress,
            kind: branchKind,
            other: branchOther
        }], { session })

        const store = await Store.findOneAndUpdate({_id: req.account.user_id.store_id}, {
            $push: {
                branch_id: branch[0]._id
            }
        }, {session, new: true})

        const role = await Role.create([{
            store_id: req.account.user_id.store_id,
            branch_id: branch[0]._id,
            name: `Branch Owner ${branch[0].name}`,
            permission,
            created_by: req.account.user_id._id
        }], {session})
    
        const user = await User.create([{
            store_id: req.account.user_id.store_id,
            branch_id: branch[0]._id,
            name,
            username,
            phone,
            email,
            address,
            role_id: role[0]._id,
            avatar: {
                public_id: myCloud?.public_id || null,
                url: myCloud?.secure_url || null
            }
        }], {session})
    
        const account = await Account.create([{
            store_id: req.account.user_id.store_id,
            branch_id: branch[0]._id,
            user_id: user[0]._id,
            username: user[0]._id,
            email: user[0].email,
            updated: user[0].email,
            password
        }], {session})

        const message = `OTP Code Sent to ${user[0].email}`

        await session.commitTransaction()

        try {
            await sendOtp(user[0].email, account[0]._id)
            res.status(200).json({
                message,
                branch,
                store,
                role,
                user
            })
        } catch(e){
            return next(new ErrorHandler(e.message))
        }
    } catch(err){
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})

exports.removeBranch = catchAsyncErrors(async (req, res, next) => {
    
    const branch = await Branch.findOne({_id: req.params.id})

    if(!branch){
        return next(
            new ErrorHandler("Branch not Founded", 404)
        )
    } else {
        await branch.remove()
        
        const store = await Store.findOneAndUpdate({_id: req.account.user_id.store_id}, {
            $pull: {
                branch_id: req.params.id
            }
        }, {new: true})

        res.status(200).json({
            success: true,
            message: "Branch Deleted Successfully",
            store
        })
    }
})
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Account = require("../models/accountModel")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const sendTokenMessage = require("../utils/jwtTokenMessage")
const sendEmail = require("../utils/sendEmail")
const sendOtp = require("../utils/otp")
const crypto = require("crypto")
const cloudinary = require("cloudinary")
const ApiFeatures = require("../utils/apiFeatures")
const mongoose = require('mongoose')
const Category = require('../models/categoryModel')

exports.registerUser = catchAsyncErrors(async (req, res, next) => {    
    const { email, password } = req.body
    
    const user = await User.findOne({email: req.body.email})
    const account = await Account.create({
        store_id: user.store_id,
        user_id: user._id,
        username: user.username,
        email,
        updated: email,
        password
    })

    try {
        await sendOtp(user.email, account._id)
        sendTokenMessage(
            account,
            200,
            res,
            `Your OTP Code Sent to ${user.email}`
        )
    } catch(e){
        return next(new ErrorHandler(e.message))
    }
})

exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
    const otp = await Account.findById(req.account._id);
    if(req.body.otp === req.account.otp.code && new Date() <= otp.otp.expire){
        const _account = await Account.findById(req.account._id)
        const account = await Account.findByIdAndUpdate(req.account._id, {
            email: _account.updated,
            verified: true
        }, {
            new: true,
            runValidators: true
        })
        const user = await User.findByIdAndUpdate(req.account.user_id._id, {
            email: _account.updated
        })

        res.status(200).json({
            success: true,
            message: "Your Email Verified Successfully"
        })
    } else {
        res.status(401).json({
            message: "OTP Code not Matched or Expired"
        })
    }
})

exports.resendOtpUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const account = await Account.findById(req.account._id)
        await sendOtp((req.body.email !== undefined)?req.body.email:req.account.email, req.account._id)

        const token = account.getJWTToken()
        sendTokenMessage(
            account,
            200,
            res,
            `Your OTP Code Sent to ${(req.body.email !== undefined)?req.body.email:req.account.email}`
        )
    } catch(e){
        return next(new ErrorHandler(e.message))
    }
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email) {
    if(!username){
        return next(new ErrorHandler("Please Enter Email or Username", 400))
    }
  } else if(!password){
    return next(new ErrorHandler("Please Enter Password", 400))
  }

    const account = await Account.findOne((email !== undefined)?{email}:{username}).select("+password")

    if(!account){
        return next(new ErrorHandler("Invalid Email or Username", 401))
    } else {
        _account = await Account.findOneAndUpdate({_id: account._id}, {
            updated: account.email
        })
    }

    const isPasswordMatched = await account.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password", 401))
    }

    sendToken(account, 200, res)
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const account = await Account.findById(req.account.id).populate('user_id')
    res.status(200).json({
        success: true,
        account
    })
})

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 2
    const usersCount = await User.countDocuments()

    const apiFeature = new ApiFeatures(User.find()
        .where("store_id", req.store._id), req.query)
            .search()
            .filter()

    let user = await apiFeature.query
    let filteredUsersCount = user.length
    apiFeature.pagination(resultPerPage)

    user = await apiFeature.query.clone()

    res.status(200).json({
        success: true,
        user,
        usersCount,
        resultPerPage,
        filteredUsersCount
    })
})

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.params.id)

    if(!user){
        return next(
            new ErrorHandler(`User with id: ${req.params.id} does not exist`)
        )
    }

    res.status(200).json({
        success: true,
        user
    })
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
    }

    const session = await mongoose.startSession()
    await session.startTransaction()

    let myCloud
    const _user = await User.findById(req.body.id || req.account.user_id.id)
    try {
        if(req.files?.avatar){  
            myCloud = await cloudinary.v2.uploader.upload(req.files.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            }, (function (err){
                throw err
            }))

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
    
        const user = await User.findByIdAndUpdate(req.body.id || req.account.user_id.id, newUserData, {
            session,
            new: true,
            runValidators: true,
            userFindAndModify: false
        })
    
        if(!req.body.email){
            await session.commitTransaction()
        
            res.status(200).json({
                success: true,
                user
            })
        } else {
            const account = await Account.findByIdAndUpdate(req.account._id, {
                updated: req.body.email,
                verified: false
            }, {
                new: true
            })

            try {
                await sendOtp(req.body.email, account._id)
                sendTokenMessage(
                    account,
                    200,
                    res,
                    `Your OTP Code Sent to ${req.body.email}`
                )
            } catch(e){
                return next(new ErrorHandler(e.message))
            }

            await session.commitTransaction()
        }
    }
    catch (err) {
        
        if(myCloud?.public_id){
            await cloudinary.v2.uploader.destroy(myCloud.public_id)
        }

        await session.abortTransaction()
        throw err
    }
    finally {
            
        if(_user.avatar.public_id && req.files?.avatar){
            await cloudinary.v2.uploader.destroy(_user.avatar.public_id)
        }
        
        await session.endSession
    }
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const account = await Account.findById(req.account.id).select("+password")
    
    const isPasswordMatched = await account.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Confirm Password does not matched", 400))
    }

    account.password = req.body.newPassword
    await account.save()
    sendToken(account, 200, res)
})

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const account = await Account.findOne({ email: req.body.email })

    if(!account){
        return next(new ErrorHandler("User not found", 404))
    }

    const resetToken = account.getResetPasswordToken()
    await account.save({validateBeforeSave: false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/mag/pos/auth/reset-password/${resetToken}`

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`
    try {
        await sendEmail({
            email: account.email,
            subject: "Poho Password",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email Send to ${account.email} Successfully`
        })
    } catch (error) {
        account.resetPasswordToken = undefined
        account.resetPasswordExpire = undefined

        await account.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))
    }
})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")
    
    const account = await Account.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!account){
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        )
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not matched", 400))
    }

    account.password = req.body.password,
    account.resetPasswordToken = undefined,
    account.resetPasswordExpire = undefined

    await account.save()

    sendToken(account, 200, res)
})

exports.createUser = catchAsyncErrors(async (req, res, next) => {
    
    let myCloud;
    if(req.files?.avatar){
        myCloud = await cloudinary.v2.uploader.upload(req.files.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        }, (function (err){
            throw err
        }))
    }

    const session = await mongoose.startSession()
    await session.startTransaction()

    const {
        name,
        username,
        phone,
        email,
        address,
        role_id,
        password
    } = req.body

    try {

        const user = await User.create([{
            store_id: req.account.store_id,
            branch_id: (req.account.branch_id !== null)?req.account.branch_id:null,
            name,
            username,
            phone,
            email,
            address,
            role_id,
            avatar: {
                public_id: myCloud?.public_id || null,
                url: myCloud?.secure_url || null
            }
        }], {session})

        const account = await Account.create([{
            store_id: req.account.store_id,
            branch_id: (req.account.branch_id !== null)?req.account.branch_id:null,
            user_id: user[0]._id,
            username: user[0].username,
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
                user,
                account
            })
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
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    const account = await Account.findOne({user_id: user._id})

    if(!user){
        return next(
            new ErrorHandler("User does not exist")
        )
    }

    if(user.avatar.public_id){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    }

    await user.remove()
    await account.remove()

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})

exports.deleteUserAccount = catchAsyncErrors(async (req, res, next) => {
    const account = await Account.findById(req.params.id)

    if(!account){
        return next(
            new ErrorHandler("Account does not exist")
        )
    }

    await account.remove()

    res.status(200).json({
        success: true,
        message: "Account Deleted Successfully"
    })
})

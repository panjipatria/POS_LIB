
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("./catchAsyncErrors")
const jwt = require("jsonwebtoken")
const Account = require("../models/accountModel")
const Role = require("../models/roleModel")
const Store = require("../models/storeModel")
const { getPermission } = require("../utils/permission")


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.account = await Account.findById(decodedData.id).populate('user_id')
    req.store = await Store.findById(decodedData.store_id)


  next();
});

exports.authorizeRoles = catchAsyncErrors(async (req, res, next) => {
    try {
        if(!req.account.verified){
            return next(
                new ErrorHandler("User Must be Verified, Please Ceck Your Email", 403)
            )
        }
        const store = await Store.findById(req.account.user_id.store_id)
        let permission = []
        
        if(store.expire >= new Date()){
            _jobs = await Promise.all (
                req.account.user_id.role_id.map(async (job) => {
                    const _job = await Role.findById(job)
                    return _job.permission
                })
            )
            _jobs.forEach(e => {
                permission = [...e, ...permission]
            })
        } else {
            permission = [
                "getAll",
                "getUserDetails"
            ]  
        }
        const _permission = getPermission(req.method+":"+req.route.path)
        if(!!_permission && permission.includes(_permission)){
            next()
        }
        else{
            throw Error(`Sorry ${req.account.user_id.username} you are is not allowed to access this page or your store is expired`)
        }
    }
        catch(e){
        return next( 
            new ErrorHandler(
            e.message, 403
            )
        )
    }
})

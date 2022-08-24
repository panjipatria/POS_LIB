const errorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    if(err.name == "CashError"){
        const message = `Resource no found. Invalid: ${err.path}`
        err = new errorHandler(message, 400)
    }

    if(err.code === 11000){
        const message = `Duplicate key Entered`
        err = new errorHandler(message, 400)
    }

    if(err.name === "TokenExpireError"){
        const message = `JSON Web Token is Expired, Try Again`
        err = new errorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
const sendTokenMessage = async (account, statusCode, res, message,data=null) => {
    const token = await account.getJWTToken()

    const options = {
        expire: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),

        httpOnly: true
    }

    let resData = {   
        success: true,
        message
    }

    if(data !== null) {
        resData['data'] = data
    }

    res.status(statusCode).cookie("token", token, options).json(resData)
}


module.exports = sendTokenMessage
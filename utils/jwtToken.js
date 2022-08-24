const sendToken = async (account, statusCode, res) => {
    const token = await account.getJWTToken()

    const options = {
        expire: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),

        httpOnly: true
    }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        account,
        token
    })
}


module.exports = sendToken
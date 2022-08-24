const sendEmail = require('./sendEmail')
const Account = require('../models/accountModel')

const sendOtp = async (email , id) => {

    var otp = Math.floor(10000 + Math.random() * 90000)
    var date = new Date()
    var time = 5
    var expires = new Date(date.getTime() + time*60000)

    const user = await Account.findByIdAndUpdate(
        id, {
            otp: {
                code: otp,
                expire: expires
            }
        },
        {new: true}
    )
    
    const message = `Your OTP Code: ${otp}`
    try {
        await sendEmail({
            email: email,
            subject: "Poho Password",
            message
        })
    } catch (error) {
        throw Error('Failed Send OTP code');
    }
}

module.exports = sendOtp
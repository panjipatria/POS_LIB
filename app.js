const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const fileUploud = require('express-fileupload')
const dotenv = require('dotenv')
const passport = require('passport')
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy
const bcrypt = require('bcryptjs')
const cors = require('cors')


const errorMiddleware = require("./middleware/error")
//config
dotenv.config({path:"config/config.env"})

passport.use(new HeaderAPIKeyStrategy(
    {
        header: 'Authorization',
        prefix: 'apikey '
    },
    false,
    function(apikey, done){
        return bcrypt.compare(process.env.API_SECRET,apikey
            ,(err,res)=>{
                if(res===false){
                    return done(new Error("API KEY doesn't Match"))
                }
                return done(null,{})
            })
    }
))

app.use(
    passport.authenticate('headerapikey', {failWithError:true, session:false}),
    (req, res, next) => {
        next()
    },
    (err,req,res,next)=> {
        return errorMiddleware(new Error("API KEY is required"),req,res,next)
    }
);

app.use(cors())

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUploud())

//Route
const user = require("./routes/userRoute")
const store = require("./routes/storeRoute")
const role = require("./routes/roleRoute")
const product = require("./routes/productRoute")
const room = require("./routes/roomRoute")
const material = require("./routes/goodsStockRoute")
const warehouse = require("./routes/warehouseRoute")
const { decode } = require('jsonwebtoken')
const ErrorHandler = require('./utils/errorHandler')

app.use("/mag/pos", user)
app.use("/mag/pos", store)
app.use("/mag/pos", product)
app.use("/mag/pos", role)
app.use("/mag/pos", room)
app.use("/mag/pos", material)
app.use("/mag/pos", warehouse)

app.use(errorMiddleware)

module.exports = app

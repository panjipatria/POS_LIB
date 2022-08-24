const app = require("./app")
const dotenv = require("dotenv")
const cloudinary = require("cloudinary")
const connectDatabse = require("./config/database")

// Handling Uncaught Exception
process.on("unchaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1)
})

// Config
dotenv.config({path:"config/config.env"})

// Connecting to Database
connectDatabse()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT,'0.0.0.0', () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Unhandle Promise Rejection`)

    server.close(() => {
        process.exit(1)
    })
})
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app: express.Application = express()

// Middleware
app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
)

// User route
import userRoute from "./api/users"
app.use("/api/", userRoute)

import productRoute from "./api/products"
app.use("/api/", productRoute)

import orderRoute from "./api/orders"
app.use("/api/", orderRoute)


app.listen(3000, function () {
    console.log(`starting app on: ${process.env.API_HOST}:${process.env.API_PORT}`)
})

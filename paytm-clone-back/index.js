require("dotenv").config()
const express = require("express");
const app = express();
const mainRouter = require("./routes/index");
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500 
const dbConn = require('./config/dbConn')
const cors = require('cors')

dbConn()





mongoose.connection.once('open' , () => {
    console.log("Connected to mongoDB")
    app.listen(PORT,() => {
        console.log(`The server running on port ${PORT}`)
    })
})
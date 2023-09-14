const express = require('express')
const app = express()
const colors = require('colors')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
dotenv.config();
const PORT=process.env.PORT
//mongodb connection
connectDB();
// middleware 
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

// route for auth 
app.use('/api/v1/auth', require("./routes/auth"))
// For Inventory 
app.use('/api/v1/inventory',require("./routes/inventoryRoutes"))

app.listen(PORT, () => {
    console.log("Node server is running ".bgRed)
})
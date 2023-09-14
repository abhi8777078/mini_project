const mongoose = require('mongoose')
const colors=require('colors')
const connectDB = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to database".bgGreen)
    } catch (error) {
        console.log('Error to Connect with database '.bgRed)
    }
}

module.exports = connectDB;
const mongoose = require('mongoose');
require('dotenv').config()
async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (error) {
        console.log('failed to connect DB')
    }
}
module.exports = connectDB;
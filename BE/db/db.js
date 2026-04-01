const mongoose = require('mongoose');
require('dotenv').config()

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (error) {
        console.log('error connecting to DB', error)
    }
}
module.exports = connectDB
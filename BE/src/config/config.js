const dotenv = require('dotenv');

dotenv.config();

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MAILTRAP_API_KEY: process.env.MAILTRAP_API_KEY
}

module.exports = config
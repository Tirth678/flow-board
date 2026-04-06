// defining schema for user and auth managment
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'], // can be only 2 values user and string
        default: 'user'
    },
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
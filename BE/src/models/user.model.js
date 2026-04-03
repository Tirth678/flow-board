const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    fullName: {
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true,
    },
    bio:{
        type: String,
        require: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel
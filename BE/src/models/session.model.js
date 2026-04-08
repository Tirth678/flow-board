const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user is required']
    },
    refreshTokenHash: {
        type: String,
        required: [true, 'token hash is required']
    },
    ip: {
        type: String,
        required: [true, 'ip is required']
    },
    userAgent: {
        type: String,
        required: [true, 'user agent is required']
    },
    revoked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const sessionModel = mongoose.model('session', sessionSchema)

module.exports = sessionModel
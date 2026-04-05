const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['up_next', 'in_progress', 'done'],
        default: 'up_next' // keep task by default as up_next
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true})

const cardModel = mongoose.model('card', cardSchema);
module.exports = cardModel
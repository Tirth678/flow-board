const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdBy: {
        tyoe: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamp: true})

const boardModel = mongoose.model("board", boardSchema);

module.exports = boardModel
const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
    orgName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})
orgSchema.index({orgName: 1, createdBy: 1}, {unique: true})
const orgModel = mongoose.model('org', orgSchema);

module.exports = orgModel;
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
    }
})

const orgModel = mongoose.model('org', orgSchema);

module.exports = orgModel;
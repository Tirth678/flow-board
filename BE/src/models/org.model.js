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
    createdBy: { // which user created the org
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})
orgSchema.index({orgName: 1, createdBy: 1}, {unique: true})
// 1 represents acseding order, where orgName and createdBy should 
// be unique everytime it is created
const orgModel = mongoose.model('org', orgSchema);

module.exports = orgModel;
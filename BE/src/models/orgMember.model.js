const mongoose = require('mongoose');

const orgMemberSchema = mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'org',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
     username: {
        type: String,
        ref: 'user'
    },
})
// same user can't be added twice to same org
orgMemberSchema.index({ orgId: 1, userId: 1 }, { unique: true });

const OrgMember = mongoose.model('orgMember', orgMemberSchema);
module.exports = OrgMember;
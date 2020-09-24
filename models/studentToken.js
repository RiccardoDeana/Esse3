const mongoose = require('mongoose');

const studentTokenSchema = mongoose.Schema({
        idStudente: {
            type: String,
            required: true,
            trim: true
        },
        token: {
            type: String,
            required: true,
            trim: true
        },
        dataCreazione: {
            type: Date,
            default: Date.now,
            expires: 1200
        }
    },
    {
        collection: 'token studenti'
    });

studentTokenSchema.index({idStudente: 1, token: 1}, {unique: true});

const StudentToken = mongoose.model('StudentToken', studentTokenSchema);

module.exports = StudentToken;
// models/studentToken.js

const mongoose = require('mongoose');

const adminTokenSchema = mongoose.Schema({
        idAdmin: {
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
            expires: 15 * 60
            // Il token si autoelimina dopo 15 min
        }
    },
    {
        collection: 'token amministratori'
    });

adminTokenSchema.index({idAdmin: 1, token: 1}, {unique: true});

const AdminToken = mongoose.model('AdminToken', adminTokenSchema);

module.exports = AdminToken;

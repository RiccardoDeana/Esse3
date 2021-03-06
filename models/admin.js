// models/admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminToken = require('./adminToken');

const adminSchema = mongoose.Schema({
        nome: {
            type: String,
            required: true,
            trim: true
        },
        cognome: {
            type: String,
            required: true,
            trim: true
        },
        matricola: {
            type: Number,
            required: true,
            min: 10000,
            max: 9999999,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 7
        },
    },
    {
        collection: 'amministratori'
    });

// Crittografa la password prima di salvarla nel database
adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
});

// Genera il token e lo salva nella tabella "token amministratori"
adminSchema.methods.generateAuthToken = async function() {
    const admin = this;
    const token = jwt.sign({_id: admin._id}, process.env.JWT_KEY);
    const adminToken = new AdminToken({idAdmin:admin._id, token:token});
    await adminToken.save();
    return token;
};

// Cancella il token dalla tabella "token amministratori"
adminSchema.methods.logOut = async function(token) {
    const admin = this;
    const result = await AdminToken.deleteOne({idAdmin:admin._id, token:token});
    return result.deletedCount !== 0;
};

// Ricerca dell'amministratore con le credenziali
adminSchema.statics.findByCredentials = async function(matricola, password) {
    const admin = await Admin.findOne({matricola});
    if (admin) {
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
            return admin;
        }
    }
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

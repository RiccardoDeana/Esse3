const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        collection: 'amministratori'
    });

adminSchema.pre('save', async function (next) {
    const admin = this;
    bcrypt.hash(admin.password, 8)
        .then((hash) => {
            admin.password = hash;
            next();
        })
        .catch((error) => next(error));
    /*
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()*/
});

adminSchema.methods.generateAuthToken = async function() {
    const admin = this;
    const token = jwt.sign({_id: admin._id}, process.env.JWT_KEY);
    admin.tokens = admin.tokens.concat({token});
    await admin.save();
    return token;
};
/*
adminSchema.statics.findByCredentials = async (matricola, password) => {
    const admin = await Admin.findOne({matricola});
    if (!admin) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return admin;
};*/

adminSchema.statics.findByCredentials = async (matricola, password) => {
    const admin = await Admin.findOne({matricola});
    if (admin) {
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
            return admin;
        }
    }
};

/*
adminSchema.statics.findByCredentials = function (matricola, password) {
    return Admin
        .findOne({matricola})
        .exec()
        .then(administrator => {
            if(administrator){
                const hashMatch = bcrypt.compare(password, administrator.password);
                if(hashMatch){
                    return administrator;
                }
            }
        });
};*/

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
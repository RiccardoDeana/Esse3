const mongoose = require('mongoose');
//const Exam = require('./exam');

const registrationSchema = mongoose.Schema({
        idEsame: {
            type: String,
            required: true,
            trim: true
        },
        nomeEsame: {
            type: String,
            required: true,
            trim: true
        },
        studente: {
            type: Number,
            required: true,
            trim: true
        },
        data: {
            type: Date,
            required: true
        }
    },
    {
        collection: 'iscrizioni'
    });

registrationSchema.index({idEsame: 1, studente: 1, data: 1}, {unique: true});

/*
registrationSchema.statics.deleteRegistration = async (id) => {
    return Registration.deleteOne({_id: id})
};*/

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
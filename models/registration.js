// models/registration.js

const mongoose = require('mongoose');

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

// Aggiunge un posto disponibile all'esame quando viene annullata un'iscrizione
registrationSchema.statics.deleteRegistration = async function(id) {
    const registration = await Registration.findOne({_id:id});
    if(registration._id){
        await mongoose.model('Exam').increaseFree(registration.idEsame);
        await Registration.deleteOne({_id:id});
    }
};

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
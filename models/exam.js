// models/exam.js

const mongoose = require('mongoose');
const Registration = require('./registration');
const Passed = require('./passed');

const examSchema = mongoose.Schema({
        nome: {
            type: String,
            required: true,
            trim: true
        },
        facolta: {
            type: String,
            required: true,
            trim: true
        },
        postiTot: {
            type: Number,
            required: true,
            min: 1
        },
        postiLiberi: {
            type: Number,
            required: true,
            validate: {
                validator: function(){
                    return (this.postiLiberi <= this.postiTot);
                }
            }
        },
        data: {
            type: Date,
            required: true
        }
    },
    {
        collection: 'esami'
    });

examSchema.index({nome: 1, facolta: 1, data: 1}, {unique: true});

// Restituisce gli esami del corso di studi, escludendo quelli già superati,
// quelli già prenotati e quelli scaduti.
examSchema.statics.findMyExams = async function(matricola, facolta) {
    const exams = await Exam.find({facolta: facolta}).sort({data: 'ascending'});

    const registrations = await Registration.find({studente: matricola});
    const idRegistrations = registrations.map(function(registration){
        return registration.idEsame;
    });

    const myPassed = await Passed.find({studente: matricola});
    const PassedNames = myPassed.map(function(passed){
        return passed.esame;
    });

    const notRegistered = exams.filter(function(exam){
        const id = exam._id.toString();
        return !(idRegistrations.includes(id));
    });

    const notRegisteredAndPassed = notRegistered.filter(function(exam){
        const nome = exam.nome.toString();
        return !(PassedNames.includes(nome));
    });

    const date = new Date();
    const newExams = notRegisteredAndPassed.filter(function(exam){
        return exam.data.getTime() > date.getTime();
    });

    return newExams;
};

// Decrementa i posti disponibili ad un esame
examSchema.statics.decreaseFree = async function(id) {
    const exam = await Exam.findOne({_id: id}, async function(err, doc){
        if(err){
            return null;
        }
        if(doc.postiLiberi > 0){
            doc.postiLiberi--;
            await doc.save();
        }
    });
    if (exam.postiLiberi > 0){
        return exam;
    }else{
        return null;
    }
};

//Incrementa i posti liberi ad un esame
examSchema.statics.increaseFree = async function(id) {
    const exam = await Exam.findOne({_id: id}, async function(err, doc){
        if(err){
            return null;
        }
        if(doc.postiLiberi < doc.postiTot){
            doc.postiLiberi++;
            await doc.save();
        }
    });
    if (exam.postiLiberi < exam.postiTot){
        return exam;
    }else{
        return null;
    }
};

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
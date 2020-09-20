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
            required: true
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

//examSchema.statics.findByNomeFacolta = async (n, f, d) => {
//    const exam = await Exam.findOne({nome: n, facolta: f, data: d});
//    if (!exam) {
//        throw new Error({ error: 'Esame non esiste' })
//    }
//    return exam;
//};


examSchema.statics.findMyExams = async (matricola, facolta) => {
    const myPassed = await  Passed.find({studente: matricola});
    const PassedNames = myPassed.map(function(passed){
        return passed.esame;
    });
    const registrations = await  Registration.find({studente: matricola});
    const idRegistrations = registrations.map(function(registration){
        return registration.idEsame;
    });
    const exams = await Exam.find({facolta: facolta});
    const notRegistered = exams.filter(function(exam){
        return exam._id in idRegistrations === false;
    });
    const notRegisteredAndPassed = notRegistered.filter(function(exam){
        return exam.nome in PassedNames === false;
    });
    return notRegisteredAndPassed;
};
/*
examSchema.statics.findMyExams = function (matricola, facolta) {
    return Exams
        .find({facolta: facolta})
        .exec()
        .then(exams => {
            if(exams){
                return exams;
            }
        });
};*/

/*
examSchema.statics.decreaseFree = async (id) => {

    const exam = await Exam.findOne({_id: id}, function(err, doc){
        if(err){
            throw new Error({ error: 'Esame non esiste' })
        }
        if(!doc){
            throw new Error({ error: 'Esame non esiste' })
        }
        if(doc.postiLiberi == 0){
            return res.status(401).send({error: 'Posti esauriti.'})
        }

        doc.postiLiberi--;
        doc.save();
    });

    return exam;
};*/

examSchema.statics.decreaseFree = function (id) {

    const exam = Exam.findOne({_id: id}, function(err, doc){
        if(err){
            return res.status(401).send({error: 'Errore di accesso al database'});
        }
        if(!doc){
            return res.status(401).send({error: 'Esame inesistente'});
        }
        if(doc.postiLiberi == 0){
            return res.status(401).send({error: 'Posti esauriti'});
        }

        doc.postiLiberi--;
        doc.save();
    });

    return exam;
};

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
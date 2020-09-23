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

examSchema.statics.findMyExams = async (matricola, facolta) => {

    const myPassed = await Passed.find({studente: matricola});
    const PassedNames = myPassed.map(function(passed){
        return passed.esame;
    });

    const registrations = await Registration.find({studente: matricola});
    const idRegistrations = registrations.map(function(registration){
        return registration.idEsame;
    });

    const exams = await Exam.find({facolta: facolta});

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

examSchema.statics.decreaseFree = async (id) => {
    const exam = await Exam.findOne({_id: id}, function(err, doc){
        if(err){
            return null;
        }
        if(doc.postiLiberi > 0){
            doc.postiLiberi--;
            doc.save();
        }
    });
    if (exam.postiLiberi > 0){
        return exam;
    }else{
        return null;
    }
};

examSchema.statics.increaseFree = async (id) => {
    const exam = await Exam.findOne({_id: id}, function(err, doc){
        if(err){
            return null;
        }
        if(doc.postiLiberi < doc.postiTot){
            doc.postiLiberi++;
            doc.save();
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
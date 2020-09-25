// models/student.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const StudentToken = require('./studentToken');

const studentSchema = mongoose.Schema({
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
        facolta: {
            type: String,
            required: true,
        }
    },
    {
        collection: 'studenti'
    });

// Crittografa la password prima di salvarla nel database
studentSchema.pre('save', async function (next) {
    const student = this;
    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
});

// Genera il token e lo salva nella tabella "token studenti"
studentSchema.methods.generateAuthToken = async function() {
    const student = this;
    const token = jwt.sign({_id: student._id}, process.env.JWT_KEY);
    const studentToken = new StudentToken({idStudente:student._id, token:token});
    await studentToken.save();
    return token;
};

// Cancella il token dalla tabella "token studenti"
studentSchema.methods.logOut = async function(token) {
    const student = this;
    const result = await StudentToken.deleteOne({idStudente:student._id, token:token});
    return result.deletedCount !== 0;
};

// Ricerca dello studente con le credenziali
studentSchema.statics.findByCredentials = async function(matricola, password) {
    const student = await Student.findOne({matricola});
    if (student) {
        const isPasswordMatch = await bcrypt.compare(password, student.password);
        if (isPasswordMatch) {
            return student;
        }
    }
};

// Rimozione dello studente con le sue prenotazioni e il libretto
studentSchema.statics.deleteStudent = async function(matricola) {
    const student = await Student.findOne({matricola:matricola});
    if(student._id){
        const registrations = await mongoose.model('Registration').find({studente : matricola});
        for(let i = 0; i < registrations.length; i++){
            await mongoose.model('Registration').deleteRegistration(registrations[i]._id);
        }
        await mongoose.model('Passed').deleteMany({studente : matricola});
        await Student.deleteOne({matricola:matricola});
    }
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        },
        tokens: [{
            token: {
                type: String
            }
        }]
    },
    {
        collection: 'studenti'
    });


studentSchema.pre('save', async function (next) {
    const student = this;
    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
});


studentSchema.methods.generateAuthToken = async function() {
    const student = this;
    const token = jwt.sign({_id: student._id}, process.env.JWT_KEY);
    student.tokens = student.tokens.concat({token});
    await student.save();
    setTimeout (function(student, token){student.logOut(token).catch((error)=>{return error;})}, 600000, student, token);
    return token;
};

studentSchema.statics.findByCredentials = async (matricola, password) => {
    const student = await Student.findOne({matricola});
    if (student) {
        const isPasswordMatch = await bcrypt.compare(password, student.password);
        if (isPasswordMatch) {
            return student;
        }
    }
};

studentSchema.methods.logOut = async function(token) {
    const student = this;
    student.tokens = student.tokens.filter((tok) => {
        return tok.token != token
    });
    await student.save();
    return student;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
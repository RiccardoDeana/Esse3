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
                type: String,
                required: true,
                expireAt: {
                    type: Date,
                    default: Date.now,
                    index: { expires: '10m' },
                }
            }
        }]
    },
    {
        collection: 'studenti'
    });

/*
studentSchema.pre('save', async function (next) {
    const student = this;
    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
});*/

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
/*
studentSchema.statics.findByMatricola = async (matricola) => {
    const student = await Student.findOne({matricola});
    if (student) {
        return student;
    }
};*/
/*
studentSchema.statics.findByCredentials = async (matricola, password) => {
    const student = await Student.findOne({matricola});
    if (!student) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, student.password);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return student;
};

studentSchema.statics.findByMatricola = async (matricola) => {
    const student = await Student.findOne({matricola});
    if (!student) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return student;
};*/

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
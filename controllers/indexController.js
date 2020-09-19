const Student = require('../models/student');
const Admin = require('../models/admin');
const Exam = require('../models/exam');
const Passed = require('../models/passed');
const Registration = require('../models/registration');

function examsPage (req, res, next) {
    const matricola = req.app.locals.matricola;
    Student.findOne({matricola})
        .then((student) => {
            facolta = student.facolta;
            Exam.findMyExams(matricola, facolta)
                .then((exams) => {
                    res.render('./exams', {esami: exams});
                })
                .catch(error => {
                    next(error);
                });
        })
        .catch(error => {
            next(error);
        });
}

function addStudentPage (req, res, next) {
    res.render('./addStudent');
}

async function firstPage (req, res, next) {
    try {
        let studentToken;
        let adminToken;

        const {matricola, password} = req.body;

        const student = await Student.findByCredentials(matricola, password);
        if(student){
            studentToken = await student.generateAuthToken();
            req.app.locals.matricola = student.matricola;
            req.app.locals.nome = student.nome;
            req.app.locals.cognome = student.cognome;
            req.app.locals.token = studentToken;
        }

        const admin = await Admin.findByCredentials(matricola, password);
        if(admin){
            adminToken = await admin.generateAuthToken();
            req.app.locals.matricola = admin.matricola;
            req.app.locals.nome = admin.nome;
            req.app.locals.cognome = admin.cognome;
            req.app.locals.token = adminToken;
        }

        if(studentToken) {
            examsPage(req, res, next);
        }else if(adminToken){
            addStudentPage(req, res, next);
        }else{
            const error = new Error('Matricola o password errati');
            error.status = 401;
            return next(error);
        }

    } catch (error) {
        next(error);
    }
}

function loginPage (req, res, next) {
    res.render('./login');
}

module.exports = {
    examsPage,
    addStudentPage,
    loginPage,
    firstPage
};
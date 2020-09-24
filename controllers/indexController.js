const Student = require('../models/student');
const Admin = require('../models/admin');
const configError = require('../middleware/configError');

async function firstPage (req, res) {
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
            res.redirect('/exams');
        }else if(adminToken){
            res.redirect('/addStudent');
        }else{
            configError('login','Matricola o password errati', res);
        }

    } catch (error) {
        configError('login',error, res);
    }
}

function loginPage (req, res) {
    res.render('login');
}

async function logout (req, res) {
    const matricola = req.app.locals.matricola;
    const token = req.app.locals.token;
    const student = await Student.findOne({matricola: matricola});
    if(student){
        await student.logOut(token)
            req.app.locals.matricola = undefined;
            req.app.locals.nome = undefined;
            req.app.locals.cognome = undefined;
            req.app.locals.token = undefined;
            res.redirect('/login');
    }

    const admin = await Admin.findOne({matricola: matricola});
    if(admin){
        await admin.logOut(token)
            req.app.locals.matricola = undefined;
            req.app.locals.nome = undefined;
            req.app.locals.cognome = undefined;
            req.app.locals.token = undefined;
            res.redirect('/login');
    }
}

module.exports = {
    loginPage,
    firstPage,
    logout
};
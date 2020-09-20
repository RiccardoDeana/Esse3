const Student = require('../models/student');
const Admin = require('../models/admin');

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
            res.redirect('/exams');
        }else if(adminToken){
            res.redirect('/addStudent');
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
    res.render('login');
}

module.exports = {
    loginPage,
    firstPage
};
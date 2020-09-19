const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const Student = require('../models/student');
const Admin = require('../models/admin');
const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

function indexRouter (controller) {

    router.get('/', configClearError('login'), controller.loginPage);

    router.post('/login', controller.firstPage, configError('login'));


/*
    router.post('/login', async(req, res, next) => {
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
                controller.examsPage(req, res, next);
            }else if(adminToken){
                controller.addStudentPage(req, res, next);
            }else{
                const error = new Error('Matricola o password errati');
                error.status = 401;
                return next(error);
            }

        } catch (error) {
            next(error);
        }
    });
*/
    return router;
}


module.exports = indexRouter;
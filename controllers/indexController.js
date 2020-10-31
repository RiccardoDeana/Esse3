// controllers/indexController.js

const Student = require('../models/student');
const Admin = require('../models/admin');
const errorRedirect = require('../messages/errorRedirect');

// Permette il login come studente oppure come amministratore
// indirizzando nella pagina corretta
async function firstPage (req, res) {
    try{
        let studentToken;
        let adminToken;

        const {matricola, password} = req.body;

        const student = await Student.findByCredentials(matricola, password);
        if(student){
            studentToken = await student.generateAuthToken();
            res.cookie('matricola', student.matricola, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('nome', student.nome, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('cognome', student.cognome, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('token', studentToken, { signed: true, overwrite: true, maxAge: 900000 });
        }

        const admin = await Admin.findByCredentials(matricola, password);
        if(admin){
            adminToken = await admin.generateAuthToken();
            res.cookie('matricola', admin.matricola, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('nome', admin.nome, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('cognome', admin.cognome, { signed: true, overwrite: true, maxAge: 900000 });
            res.cookie('token', adminToken, { signed: true, overwrite: true, maxAge: 900000 });
        }

        if(studentToken) {
            res.redirect('/exams');
        }else if(adminToken){
            res.redirect('/addStudent');
        }else{
            errorRedirect('login','Matricola o password errati', req, res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

// Renderizza la pagina di login
async function loginPage (req, res) {
    try{
        res.status(200).render('login');
    }catch (error){
        res.status(400).send(error);
    }
}

// Esegue il logout e riporta alla pagina di login
async function logout (req, res) {
    try{
        const matricola = req.signedCookies.matricola;
        const token = req.signedCookies.token;
        const student = await Student.findOne({matricola: matricola});
        if(student){
            await student.logOut(token);
            res.clearCookie('matricola');
            res.clearCookie('nome');
            res.clearCookie('cognome');
            res.clearCookie('token');
            res.redirect('/login');
        }

        const admin = await Admin.findOne({matricola: matricola});
        if(admin){
            await admin.logOut(token);
            res.clearCookie('matricola');
            res.clearCookie('nome');
            res.clearCookie('cognome');
            res.clearCookie('token');
            res.redirect('/login');
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    loginPage,
    firstPage,
    logout
};
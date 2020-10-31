// controllers/remStudentController.js

const Student = require('../models/student');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina per rimuovere uno studente
async function remStudentGET (req, res) {
    try{
        const nome = req.signedCookies.nome;
        const cognome = req.signedCookies.cognome;
        res.status(200).render('remStudent', {nome: nome, cognome: cognome});
    }catch (error){
        res.status(400).send(error);
    }
}

// Rimuove uno studente
// verificando che la matricola esista
async function remStudentPOST (req, res) {
    try{
        const student = await Student.findOne({matricola:req.body.matricola});
        if(student){
            await Student.deleteStudent(req.body.matricola);
            successRedirect('remStudent','Studente rimosso', req, res);
        }else{
            errorRedirect('remStudent','Lo studente non esiste', req, res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    remStudentGET,
    remStudentPOST
};
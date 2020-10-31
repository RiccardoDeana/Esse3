// controllers/addStudentController.js

const Student = require('../models/student');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina per aggiungere un nuovo studente
async function addStudentGET (req, res) {
    try{
        const nome = req.signedCookies.nome;
        const cognome = req.signedCookies.cognome;
        res.status(200).render('addStudent', {nome: nome, cognome: cognome});
    }catch (error){
        res.status(400).send(error);
    }
}

// Aggiunge un nuovo studente
// verificando che la matricola sia unica
async function addStudentPOST (req, res) {
    try{
        const dati = req.body;
        const student = new Student(dati);
        await student.save(function(err){
            if(err){
                errorRedirect('addStudent','Studente già aggiunto', req, res);
            }else{
                successRedirect('addStudent','Studente aggiunto', req, res);
            }
        });
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    addStudentGET,
    addStudentPOST
};
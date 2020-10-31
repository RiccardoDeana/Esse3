// controllers/addExamController.js

const Exam = require('../models/exam');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina per aggiungere un esame
async function addExamGET (req, res) {
    try{
        const nome = req.signedCookies.nome;
        const cognome = req.signedCookies.cognome;
        res.status(200).render('addExam', {nome: nome, cognome: cognome});
    }catch (error){
        res.status(400).send(error);
    }
}

// Aggiunge un esame
// verificando che non sia già inserito
async function addExamPOST (req, res) {
    try{
        const dati = {
            "nome": req.body.nome.toUpperCase(),
            "facolta": req.body.facolta,
            "postiTot": req.body.posti,
            "postiLiberi": req.body.posti,
            "data": req.body.data
        };
        const exam = new Exam(dati);
        await exam.save(function(err){
            if(err){
                errorRedirect('addExam','Esame già aggiunto', req, res);
            }else{
                successRedirect('addExam','Esame aggiunto', req, res);
            }
        });
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    addExamGET,
    addExamPOST
};
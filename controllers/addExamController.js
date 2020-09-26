// controllers/addExamController.js

const Exam = require('../models/exam');
const configError = require('../middleware/configError');
const configSuccess = require('../middleware/configSuccess');

// Renderizza la pagina per aggiungere un esame
async function addExamGET (req, res) {
    res.render('./addExam');
}

// Aggiunge un esame
// verificando che non sia già inserito
async function addExamPOST (req, res) {
    const dati = {
        "nome": req.body.nome,
        "facolta": req.body.facolta,
        "postiTot": req.body.posti,
        "postiLiberi": req.body.posti,
        "data": req.body.data
    };
    const exam = new Exam(dati);
    await exam.save(function(err){
        if(err){
            configError('addExam','Esame già aggiunto', res);
        }else{
            configSuccess('addExam','Esame aggiunto', res);
        }
    });
}

module.exports = {
    addExamGET,
    addExamPOST
};
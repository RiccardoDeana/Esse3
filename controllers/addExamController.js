// controllers/addExamController.js

const Exam = require('../models/exam');
const configError = require('../middleware/configError');
const configSuccess = require('../middleware/configSuccess');

// Renderizza la pagina per aggiungere un esame
async function addExamGET (req, res) {
    try{
        res.render('./addExam');
    }catch (error){
        console.log(error);
    }
}

// Aggiunge un esame
// verificando che non sia già inserito
async function addExamPOST (req, res) {
    try{
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
    }catch (error){
        console.log(error);
    }
}

module.exports = {
    addExamGET,
    addExamPOST
};
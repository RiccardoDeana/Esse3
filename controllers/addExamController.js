const Exam = require('../models/exam');
const configError = require('../middleware/configError');

function addExamGET (req, res) {
    res.render('./addExam');
}

function addExamPOST (req, res) {
    const dati = {
        "nome": req.body.nome,
        "facolta": req.body.facolta,
        "postiTot": req.body.posti,
        "postiLiberi": req.body.posti,
        "data": req.body.data
    };
    const exam = new Exam(dati);
    exam.save(function(err){
        if(err){
            configError('addExam','Esame già aggiunto', res);
        }else{
            res.redirect('/addExam');
        }
    });
}

module.exports = {
    addExamGET,
    addExamPOST
};
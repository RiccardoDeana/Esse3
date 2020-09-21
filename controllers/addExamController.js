const Exam = require('../models/exam');

function addExamGET (req, res, next) {
    res.render('./addExam');
}

function addExamPOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
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
            console.log(err)
            const error = new Error('Esame già aggiunto');
            error.status = 401;
            return next(error);
        }else{
            res.redirect('/addExam');
        }
    });
}

module.exports = {
    addExamGET,
    addExamPOST
};
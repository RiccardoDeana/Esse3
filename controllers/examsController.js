const Student = require('../models/student');
const Exam = require('../models/exam');
const Registration = require('../models/registration');

function examsGET (req, res, next) {
    const matricola = req.app.locals.matricola;
    Student.findOne({matricola})
        .then((student) => {
            facolta = student.facolta;
            Exam.findMyExams(matricola, facolta)
                .then((exams) => {
                    req.app.locals.myExams = exams;
                    res.render('exams');
                })
                .catch(error => {
                    next(error);
                });
        })
        .catch(error => {
            next(error);
        });
}

function examsPOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const dati = req.body;
    const id = dati.idEsame;
    Exam.decreaseFree(id)
        .then(exam => {
            const date = new Date();
            if(exam){
                if(exam.data.getTime() > date.getTime()){
                    const registration = new Registration(dati);
                    registration.save(function(err){
                        if(err){
                            Exam.increaseFree(id)
                                .then(() =>{
                                    const error = new Error('Prenotazione già effettuata');
                                    error.status = 401;
                                    return next(error);
                                }).catch(error => {
                                return next(error);
                            });
                        }else{
                            res.redirect('/exams');
                        }
                    });
                }else{
                    const error = new Error('Esame scaduto');
                    error.status = 401;
                    return next(error);
                }

            }else{
                const error = new Error('Posti esauriti');
                error.status = 401;
                return next(error);
            }
    }).catch(error => {
        return next(error);
    });

}

module.exports = {
    examsGET,
    examsPOST
};
const Student = require('../models/student');
const Exam = require('../models/exam');
const Registration = require('../models/registration');
const configError = require('../middleware/configError');

function examsGET (req, res) {
    const matricola = req.app.locals.matricola;
    Student.findOne({matricola})
        .then((student) => {
            const facolta = student.facolta;
            Exam.findMyExams(matricola, facolta)
                .then((exams) => {
                    req.app.locals.myExams = exams;
                    res.render('exams');
                })
                .catch(error => {
                    configError('exams',error, res);
                });
        })
        .catch(error => {
            configError('exams',error, res);
        });
}

function examsPOST (req, res) {
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
                                    configError('exams','Prenotazione già effettuata', res);
                                })
                                .catch(error => {
                                    configError('exams',error, res);
                                });
                        }else{
                            res.redirect('/exams');
                        }
                    })
                }else{
                    configError('exams','Esame scaduto', res);
                }

            }else{
                configError('exams','Posti esauriti', res);
            }
    }).catch(error => {
        configError('exams',error, res);
    });

}

module.exports = {
    examsGET,
    examsPOST
};
const Student = require('../models/student');
const Exam = require('../models/exam');

function examsGET (req, res, next) {
    const matricola = req.app.locals.matricola;
    Student.findOne({matricola})
        .then((student) => {
            facolta = student.facolta;
            Exam.findMyExams(matricola, facolta)
                .then((exams) => {
                    res.render('./exams', {esami: exams});
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
    Exam.decreaseFree(dati._idEsame)
        .then(exam => {
            const registration = new Registration(dati)
            registration.save()
        })
        .then(() => res.redirect('/exams'))
        .catch(error => next(error));
}

module.exports = {
    examsGET,
    examsPOST
};
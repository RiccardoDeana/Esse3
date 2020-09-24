const Student = require('../models/student');
const Exam = require('../models/exam');
const Registration = require('../models/registration');
const configError = require('../middleware/configError');

async function examsGET (req, res) {
    const matricola = req.app.locals.matricola;
    const student = await Student.findOne({matricola});
    if(student){
        const facolta = student.facolta;
        const exams = await Exam.findMyExams(matricola, facolta);
        req.app.locals.myExams = exams;
        res.render('exams');
    }
}

async function examsPOST (req, res) {
    const dati = req.body;
    const id = dati.idEsame;
    const exam = await Exam.decreaseFree(id);
    if(exam){
        const date = new Date();
        if(exam.data.getTime() > date.getTime()){
            const registration = new Registration(dati);
            registration.save(async function(err){
                if(err){
                    await Exam.increaseFree(id);
                    configError('exams','Prenotazione già effettuata', res);
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

}

module.exports = {
    examsGET,
    examsPOST
};
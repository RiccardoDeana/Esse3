// controllers/examsController.js

const Student = require('../models/student');
const Exam = require('../models/exam');
const Registration = require('../models/registration');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina con gli esami prenotabili
async function examsGET (req, res) {
    try{
        const matricola = req.signedCookies.matricola;
        const student = await Student.findOne({matricola});
        if(student){
            const facolta = student.facolta;
            const exams = await Exam.findMyExams(matricola, facolta);
            const nome = req.signedCookies.nome;
            const cognome = req.signedCookies.cognome;
            res.status(200).render('exams', {myExams: exams, matricola: matricola, nome: nome, cognome: cognome});
        }
    }catch (error){
        res.status(400).send(error);
    }
}

// Effettua la prenotazione di un esame
// controllando la disponibilità dei posti
async function examsPOST (req, res) {
    try{
        const dati = req.body;
        const id = dati.idEsame;
        const exam = await Exam.decreaseFree(id);
        if(exam){
            const date = new Date();
            if(exam.data.getTime() > date.getTime()){
                const registration = new Registration(dati);
                await registration.save(async function(err){
                    if(err){
                        await Exam.increaseFree(id);
                        errorRedirect('exams','Prenotazione già effettuata', req, res);
                    }else{
                        successRedirect('exams','Prenotazione effettuata', req, res);
                    }
                })
            }else{
                await Exam.increaseFree(id);
                errorRedirect('exams','Esame scaduto', req, res);
            }
        }else{
            errorRedirect('exams','Posti esauriti', req, res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    examsGET,
    examsPOST
};
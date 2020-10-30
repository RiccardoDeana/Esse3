// controllers/remStudentController.js

const Student = require('../models/student');
const configError = require('../messages/configError');
const configSuccess = require('../messages/configSuccess');

// Renderizza la pagina per rimuovere uno studente
async function remStudentGET (req, res) {
    try{
        res.status(200).render('./remStudent');
    }catch (error){
        res.status(400).send(error);
    }
}

// Rimuove uno studente
// verificando che la matricola esista
async function remStudentPOST (req, res) {
    try{
        const student = await Student.findOne({matricola:req.body.matricola});
        if(student){
            await Student.deleteStudent(req.body.matricola);
            configSuccess('remStudent','Studente rimosso', res);
        }else{
            configError('remStudent','Lo studente non esiste', res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    remStudentGET,
    remStudentPOST
};
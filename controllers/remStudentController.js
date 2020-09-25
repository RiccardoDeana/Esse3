// controllers/remStudentController.js

const Student = require('../models/student');
const configError = require('../middleware/configError');

// Renderizza la pagina per rimuovere uno studente
async function remStudentGET (req, res) {
    res.render('./remStudent');
}

// Rimuove uno studente
// verificando che la matricola esista
async function remStudentPOST (req, res) {
    const student = await Student.findOne({matricola:req.body.matricola});
    if(student){
        await Student.deleteStudent(req.body.matricola);
        res.redirect('/remStudent');
    }else{
        configError('remStudent','Lo studente non esiste', res);
    }
}

module.exports = {
    remStudentGET,
    remStudentPOST
};
// controllers/addStudentController.js

const Student = require('../models/student');
const configError = require('../middleware/configError');
const configSuccess = require('../middleware/configSuccess');

// Renderizza la pagina per aggiungere un nuovo studente
async function addStudentGET (req, res) {
    res.render('./addStudent');
}

// Aggiunge un nuovo studente
// verificando che la matricola sia unica
async function addStudentPOST (req, res) {
    const dati = req.body;
    const student = new Student(dati);
    await student.save(function(err){
        if(err){
            configError('addStudent','Studente già aggiunto', res);
        }else{
            configSuccess('addStudent','Studente aggiunto', res);
        }
    });
}

module.exports = {
    addStudentGET,
    addStudentPOST
};
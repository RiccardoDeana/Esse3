// controllers/addStudentController.js

const Student = require('../models/student');
const configError = require('../messages/configError');
const configSuccess = require('../messages/configSuccess');

// Renderizza la pagina per aggiungere un nuovo studente
async function addStudentGET (req, res) {
    try{
        res.render('./addStudent');
    }catch (error){
        console.log(error);
    }
}

// Aggiunge un nuovo studente
// verificando che la matricola sia unica
async function addStudentPOST (req, res) {
    try{
        const dati = req.body;
        const student = new Student(dati);
        await student.save(function(err){
            if(err){
                configError('addStudent','Studente già aggiunto', res);
            }else{
                configSuccess('addStudent','Studente aggiunto', res);
            }
        });
    }catch (error){
        console.log(error);
    }
}

module.exports = {
    addStudentGET,
    addStudentPOST
};
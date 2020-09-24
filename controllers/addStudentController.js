const Student = require('../models/student');
const configError = require('../middleware/configError');

function addStudentGET (req, res) {
    res.render('./addStudent');
}

function addStudentPOST (req, res) {
    if (!req.body) return res.sendStatus(400);
    const dati = req.body;
    const student = new Student(dati);
    student.save(function(err){
        if(err){
            configError('addStudent','Studente già aggiunto', res);
        }else{
            res.redirect('/addStudent');
        }
    });
}

module.exports = {
    addStudentGET,
    addStudentPOST
};
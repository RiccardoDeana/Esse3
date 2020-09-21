const Student = require('../models/student');

function addStudentGET (req, res, next) {
    res.render('./addStudent');
}

function addStudentPOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const dati = req.body;
    const student = new Student(dati);
    student.save(function(err){
        if(err){
            const error = new Error('Studente già aggiunto');
            error.status = 401;
            return next(error);
        }else{
            res.redirect('/addStudent');
        }
    });
}

module.exports = {
    addStudentGET,
    addStudentPOST
};
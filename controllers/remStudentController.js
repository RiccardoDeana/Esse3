const Student = require('../models/student');

function remStudentGET (req, res, next) {
    res.render('./remStudent');
}

function remStudentPOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    Student.findOne({matricola:req.body.matricola})
        .then(student => {
            if(student){
                Student.deleteStudent(req.body.matricola)
                    .then(() =>{
                        res.redirect('/remStudent');
                    })
                    .catch(error => {
                        return next(error)});
            }
            else{
                const error = new Error('Lo studente non esiste');
                error.status = 401;
                return next(error);
            }
        })
        .catch(error => {
            return next(error)});
}

module.exports = {
    remStudentGET,
    remStudentPOST
};
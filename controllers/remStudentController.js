const Student = require('../models/student');
const configError = require('../middleware/configError');

function remStudentGET (req, res) {
    res.render('./remStudent');
}

function remStudentPOST (req, res) {
    if (!req.body) return res.sendStatus(400);
    Student.findOne({matricola:req.body.matricola})
        .then(student => {
            if(student){
                Student.deleteStudent(req.body.matricola)
                    .then(() =>{
                        res.redirect('/remStudent');
                    })
                    .catch(error => {
                        configError('remStudent',error, res);
                    });
            }
            else{
                configError('remStudent','Lo studente non esiste', res);
            }
        })
        .catch(error => {
            configError('remStudent',error, res);
        });
}

module.exports = {
    remStudentGET,
    remStudentPOST
};
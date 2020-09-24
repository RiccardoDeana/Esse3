const Student = require('../models/student');
const configError = require('../middleware/configError');

function remStudentGET (req, res) {
    res.render('./remStudent');
}

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
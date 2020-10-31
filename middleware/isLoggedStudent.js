// middleware/isLoggedStudent.js

const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const StudentToken = require('../models/studentToken');
const errorRedirect = require('../messages/errorRedirect');

// Verifica se lo studente è loggato
// in caso affermativo rinnova il token
// altrimenti rimanda alla pagina di login
async function isLoggedStudent (req, res, next) {
    const token = req.signedCookies.token;
    if(token){
        const data = jwt.verify(token, process.env.JWT_KEY);
        const studentToken = await StudentToken.findOne({ idStudente: data._id, token: token});
        if(studentToken) {
            const student = await Student.findOne({_id: studentToken.idStudente});
            if(student){
                const result = await student.logOut(token);
                if (result) {
                    student.generateAuthToken()
                        .then((tok) => {
                            res.cookie('token', tok, { signed: true, overwrite: true, maxAge: 900000 });
                            return next();
                        })
                        .catch(error => {
                            errorRedirect('login',error, req, res);
                        })
                }
            }else {
                errorRedirect('login', 'Utente non esiste', req, res);
            }
        }else {
            errorRedirect('login', 'Sessione scaduta. Per accedere devi eseguire il login', req, res);
        }
    }else{
        errorRedirect('login', 'Non sei autorizzato ad accedere a questa risorsa', req, res);
    }

}


module.exports = isLoggedStudent;
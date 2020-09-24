const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const StudentToken = require('../models/studentToken');
const ErrorRedirect = require('./ErrorRedirect');

function isLoggedStudent (req, res, next) {

    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    StudentToken.findOne({ idStudente: data._id, token: token})
        .then(studenttoken => {
            if (studenttoken) {
                Student.findOne({_id: studenttoken.idStudente})
                    .then(student => {
                        student.logOut(token)
                            .then(result => {
                                if (result) {
                                    student.generateAuthToken()
                                        .then((tok) => {
                                            req.app.locals.token = tok;
                                            return next();
                                        })
                                        .catch(error => {
                                            ErrorRedirect('login',error, req, res);
                                        })
                                }
                                return next();
                            })
                            .catch(error => {
                                ErrorRedirect('login',error, req, res);
                            })
                    })
                    .catch(error => {
                        ErrorRedirect('login',error, req, res);
                    })

            } else {
                ErrorRedirect('login','Sessione scaduta. Per accedere devi eseguire il login', req, res);
            }
        })
        .catch(error => {
            ErrorRedirect('login',error, req, res);
        })
}


module.exports = isLoggedStudent;
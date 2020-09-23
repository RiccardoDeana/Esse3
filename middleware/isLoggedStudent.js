const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const StudentToken = require('../models/studentToken');

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
                                            return next(error);
                                        })
                                }
                                return next();
                            })
                            .catch(error => {
                                return next(error);
                            })
                    })
                    .catch(error => {
                        return next(error);
                    })

            } else {
                const target = req.app.locals.error || {};
                Object.assign(target,
                    {
                        login: {
                            msg: 'Sessione scaduta. Per accedere devi eseguire il login',
                            isErrorValid: true
                        }
                    });
                req.app.locals.error = target;
                res.redirect('/login');
            }
        })
        .catch(error => {
            return next(error);
        })
}


module.exports = isLoggedStudent;
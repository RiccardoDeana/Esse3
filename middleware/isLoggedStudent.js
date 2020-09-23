const jwt = require('jsonwebtoken');
const Student = require('../models/student');

function isLoggedStudent (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    Student.findOne({ _id: data._id})
        .then(student => {
            if (student) {
                student.logOut(token)
                    .then((result) =>{
                        if(result){
                            student.generateAuthToken()
                                .then((tok) => {
                                    req.app.locals.token = tok;
                                    return next();
                                })
                                .catch(error => {
                                    return next(error);
                                })
                        }else{
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
            } else {
                const target = req.app.locals.error || {};
                Object.assign(target,
                    {
                        login: {
                            msg: 'Utente non esiste',
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
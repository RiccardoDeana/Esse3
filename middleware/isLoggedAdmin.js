const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

function isLoggedAdmin (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    Admin.findOne({ _id: data._id})
        .then(admin => {
            if (admin) {
                admin.logOut(token)
                    .then((result) =>{
                        if(result){
                            admin.generateAuthToken()
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

module.exports = isLoggedAdmin;
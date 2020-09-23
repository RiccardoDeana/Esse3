const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const AdminToken = require('../models/adminToken');

function isLoggedAdmin (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    AdminToken.findOne({ idAdmin: data._id, token: token})
        .then(admintoken => {
            if (admintoken) {
                Admin.findOne({_id: admintoken.idAdmin})
                    .then(admin => {
                        admin.logOut(token)
                            .then(result => {
                                if (result) {
                                    admin.generateAuthToken()
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

module.exports = isLoggedAdmin;
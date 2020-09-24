const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const AdminToken = require('../models/adminToken');
const ErrorRedirect = require('./ErrorRedirect');

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
                                            ErrorRedirect('login',error, req, res);
                                        })
                                }
                                return next();
                            })
                            .catch(error => {
                                ErrorRedirect('login',error, req, req, res);
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

module.exports = isLoggedAdmin;
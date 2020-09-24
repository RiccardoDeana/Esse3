const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const AdminToken = require('../models/adminToken');
const ErrorRedirect = require('./ErrorRedirect');

async function isLoggedAdmin (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const adminToken = await AdminToken.findOne({ idAdmin: data._id, token: token});
    if(adminToken) {
        const admin = await Admin.findOne({_id: adminToken.idAdmin});
        if(admin){
            const result = await admin.logOut(token);
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
        }else {
            ErrorRedirect('login','Utente non esiste', req, res);
        }
    }else {
        ErrorRedirect('login','Sessione scaduta. Per accedere devi eseguire il login', req, res);
    }
}

module.exports = isLoggedAdmin;
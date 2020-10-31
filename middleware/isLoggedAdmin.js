// middleware/isLoggedAdmin.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const AdminToken = require('../models/adminToken');
const errorRedirect = require('../messages/errorRedirect');

// Verifica se l'amministratore è loggato
// in caso affermativo rinnova il token
// altrimenti rimanda alla pagina di login
async function isLoggedAdmin (req, res, next) {
    const token = req.signedCookies.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const adminToken = await AdminToken.findOne({ idAdmin: data._id, token: token});
    if(adminToken) {
        const admin = await Admin.findOne({_id: adminToken.idAdmin});
        if(admin){
            const result = await admin.logOut(token);
            if (result) {
                admin.generateAuthToken()
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
}

module.exports = isLoggedAdmin;
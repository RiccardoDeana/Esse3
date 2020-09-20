const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

function isLoggedAdmin (req, res, next) {
    const token = req.app.locals.token;
    const data = jwt.verify(token, process.env.JWT_KEY);
    const admin = Admin.findOne({ _id: data._id, 'tokens.token': token });
    if (admin) {
        return next();
    } else {
        const target = req.app.locals.error || {};
        Object.assign(target,
            {
                login: {
                    msg: 'Area protetta. Per accedere devi eseguire il login',
                    isErrorValid: true
                }
            });
        req.app.locals.error = target;
        res.redirect('/login');
    }
}

module.exports = isLoggedAdmin;
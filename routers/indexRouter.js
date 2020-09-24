const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');

function indexRouter (controller) {

    router.get('/', function(req, res) {
        res.redirect('/login');
    });
    router.get('/login', configClearError('login'), controller.loginPage);
    router.post('/login', controller.firstPage);
    router.post('/logout', controller.logout);

    return router;
}

module.exports = indexRouter;
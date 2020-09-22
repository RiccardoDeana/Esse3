const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

function indexRouter (controller) {

    router.get('/', function(req, res) {
        res.redirect('/login');
    });
    router.get('/login', configClearError('login'), controller.loginPage);
    router.post('/login', controller.firstPage, configError('login'));
    router.post('/logout', controller.logout);

    return router;
}

module.exports = indexRouter;
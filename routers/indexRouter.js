// routers/indexRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const AdminToken = require('../models/adminToken');
const StudentToken = require('../models/studentToken');

function indexRouter (controller) {

    router.get('/', async function(req, res) {
        res.redirect('/login');
    });

    router.get('/login', clearMessages('login'), controller.loginPage);

    router.post('/login', controller.firstPage);

    router.post('/logout', controller.logout);

    return router;
}

module.exports = indexRouter;
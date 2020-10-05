// routers/registrationRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedStudent = require('../middleware/isLoggedStudent');

function registrationsRouter (controller) {
    router.route('/registrations')
        .all(isLoggedStudent)
        .get(clearMessages('registrations'), controller.registrationsGET)
        .post(controller.registrationsPOST);

    return router;
}

module.exports = registrationsRouter;
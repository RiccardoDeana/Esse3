const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const isLoggedStudent = require('../middleware/isLoggedStudent');

function registrationsRouter (controller) {

    router.route('/registrations')
        .all(isLoggedStudent)
        .get(configClearError('registrations'), controller.registrationsGET)
        .post(controller.registrationsPOST);

    return router;
}

module.exports = registrationsRouter;
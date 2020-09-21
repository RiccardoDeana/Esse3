const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const isLoggedStudent = require('../middleware/isLoggedStudent');

function examsRouter (controller) {

    router.route('/registrations')
        .all(isLoggedStudent)
        .get(configClearError('registrations'), controller.registrationsGET)
        .post(controller.registrationsPOST, configError('registrations'));

    return router;
}

module.exports = examsRouter;
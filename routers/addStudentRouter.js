const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function addStudentRouter (controller) {

    router.route('/addStudent')
        .all(isLoggedAdmin)
        .get(configClearError('addStudent'), controller.addStudentGET)
        .post(controller.addStudentPOST, configError('addStudent'));

    return router;
}

module.exports = addStudentRouter;
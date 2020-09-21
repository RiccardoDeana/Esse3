const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');


function remStudentRouter (controller) {
    router.route('/remStudent')
        .all(isLoggedAdmin)
        .get(configClearError('remStudent'), controller.remStudentGET)
        .post(controller.remStudentPOST, configError('remStudent'));

    return router;
}

module.exports = remStudentRouter;
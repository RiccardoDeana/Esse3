// routers/addStudentRouter.js

const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function addStudentRouter (controller) {
    router.route('/addStudent')
        .all(isLoggedAdmin)
        .get(configClearError('addStudent'), controller.addStudentGET)
        .post(controller.addStudentPOST);

    return router;
}

module.exports = addStudentRouter;
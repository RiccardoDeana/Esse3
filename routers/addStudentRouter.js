// routers/addStudentRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function addStudentRouter (controller) {
    router.route('/addStudent')
        .all(isLoggedAdmin)
        .get(clearMessages('addStudent'), controller.addStudentGET)
        .post(controller.addStudentPOST);

    return router;
}

module.exports = addStudentRouter;
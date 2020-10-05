// routers/remStudentRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function remStudentRouter (controller) {
    router.route('/remStudent')
        .all(isLoggedAdmin)
        .get(clearMessages('remStudent'), controller.remStudentGET)
        .post(controller.remStudentPOST);

    return router;
}

module.exports = remStudentRouter;
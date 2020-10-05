// routers/addExamRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function addExamRouter (controller) {
    router.route('/addExam')
        .all(isLoggedAdmin)
        .get(clearMessages('addExam'), controller.addExamGET)
        .post(controller.addExamPOST);

    return router;
}

module.exports = addExamRouter;
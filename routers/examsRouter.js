// routers/examsRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedStudent = require('../middleware/isLoggedStudent');

function examsRouter (controller) {
    router.route('/exams')
        .all(isLoggedStudent)
        .get(clearMessages('exams'), controller.examsGET)
        .post(controller.examsPOST);

    return router;
}

module.exports = examsRouter;
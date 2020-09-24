const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const isLoggedStudent = require('../middleware/isLoggedStudent');

function examsRouter (controller) {

    router.route('/exams')
        .all(isLoggedStudent)
        .get(configClearError('exams'), controller.examsGET)
        .post(controller.examsPOST);

    return router;
}

module.exports = examsRouter;
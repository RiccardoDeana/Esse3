const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function addExamRouter (controller) {

    router.route('/addExam')
        .all(isLoggedAdmin)
        .get(configClearError('addExam'), controller.addExamGET)
        .post(controller.addExamPOST, configError('addExam'));

    return router;
}

module.exports = addExamRouter;
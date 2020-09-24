const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function regGradeRouter (controller) {

    router.route('/regGrade')
        .all(isLoggedAdmin)
        .get(configClearError('regGrade'), controller.regGradeGET)
        .post(controller.regGradePOST);

    return router;
}

module.exports = regGradeRouter;
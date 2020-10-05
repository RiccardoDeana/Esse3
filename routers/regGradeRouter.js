// routers/regGradeRouter.js

const express = require('express');
const router = express.Router();
const clearMessages = require('../middleware/clearMessages');
const isLoggedAdmin = require('../middleware/isLoggedAdmin');

function regGradeRouter (controller) {
    router.route('/regGrade')
        .all(isLoggedAdmin)
        .get(clearMessages('regGrade'), controller.regGradeGET)
        .post(controller.regGradePOST);

    return router;
}

module.exports = regGradeRouter;
const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const configError = require('../middleware/configError');
const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

function indexRouter (controller) {

    router.route('/remStudent')
        .get(configClearError('remStudent'), controller.remStudentGET)
        .post(controller.remStudentPOST, configError('remStudent'));

    return router;
}

module.exports = indexRouter;
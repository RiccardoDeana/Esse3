// routers/passedRouter.js

const express = require('express');
const router = express.Router();
const isLoggedStudent = require('../middleware/isLoggedStudent');

function passedRouter (controller) {
    router.get('/passed', isLoggedStudent, controller.passedGET);

    return router;
}

module.exports = passedRouter;
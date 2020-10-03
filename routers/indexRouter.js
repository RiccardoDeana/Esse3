// routers/indexRouter.js

const express = require('express');
const router = express.Router();
const configClearError = require('../middleware/configClearError');
const AdminToken = require('../models/adminToken');
const StudentToken = require('../models/studentToken');

function indexRouter (controller) {

    router.get('/', async function(req, res) {
        try{
            const token = req.app.locals.token;
            const student = await StudentToken.findOne({token:token});
            const admin = await AdminToken.findOne({token:token});
            if(student){
                res.redirect('/exams');
            }else if(admin){
                res.redirect('/addStudent');
            }else{
                res.redirect('/login');
            }
        }catch (error){
            console.log(error);
        }

    });

    router.get('/login', configClearError('login'), controller.loginPage);

    router.post('/login', controller.firstPage);

    router.post('/logout', controller.logout);

    return router;
}

module.exports = indexRouter;
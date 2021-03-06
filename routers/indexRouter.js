// routers/indexRouter.js

const express = require('express');
const router = express.Router();
const StudentToken = require('../models/studentToken');
const AdminToken = require('../models/adminToken');
const clearMessages = require('../middleware/clearMessages');

function indexRouter (controller) {

    //Controlla se l'utente è già loggato
    //in caso affermativo lo manda alla pagina corretta
    //altrimenti al login
    router.get('/', async function(req, res) {

        try{
            const matricola = req.signedCookies.matricola;
            if(matricola){
                const token = req.signedCookies.token;
                const student = await StudentToken.findOne({token: token});
                const admin = await AdminToken.findOne({token: token});
                if(student){
                    res.redirect('/exams');
                }else if(admin){
                    res.redirect('/addStudent');
                }else{
                    res.redirect('/login');
                }
            }else{
                res.redirect('/login');
            }
        }catch (error){
            res.status(400).send(error);
        }
    });

    router.get('/login', clearMessages('login'), controller.loginPage);

    router.post('/login', controller.firstPage);

    router.post('/logout', controller.logout);

    return router;
}

module.exports = indexRouter;
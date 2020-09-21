const Passed = require('../models/passed');

function passedGET (req, res, next) {
    const matricola = req.app.locals.matricola;

    Passed.find({studente : matricola})
        .then(myPassed => {
            req.app.locals.myPassed = myPassed;
            res.render('passed');
        }).catch(error => {
        next(error);
    });
}


module.exports = {
    passedGET
};
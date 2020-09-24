const Passed = require('../models/passed');
const configError = require('../middleware/configError');

function passedGET (req, res) {
    const matricola = req.app.locals.matricola;

    Passed.find({studente : matricola})
        .then(myPassed => {
            req.app.locals.myPassed = myPassed;
            res.render('passed');
        }).catch(error => {
        configError('passed',error, res);
    });
}


module.exports = {
    passedGET
};
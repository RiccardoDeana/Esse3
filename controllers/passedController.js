const Passed = require('../models/passed');
const configError = require('../middleware/configError');

function passedGET (req, res) {
    const matricola = req.app.locals.matricola;

    Passed.find({studente : matricola})
        .then(myPassed => {
            let mean = 0;
            for(let i = 0; i < myPassed.length; i++){
                mean += myPassed[i].voto;
            }
            mean = mean / myPassed.length;
            mean = mean.toFixed(2);
            req.app.locals.myPassed = myPassed;
            req.app.locals.mean = mean;
            res.render('passed');
        }).catch(error => {
        configError('passed',error, res);
    });
}


module.exports = {
    passedGET
};
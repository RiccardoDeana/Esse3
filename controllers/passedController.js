const Passed = require('../models/passed');
const configError = require('../middleware/configError');

async function passedGET (req, res) {
    const matricola = req.app.locals.matricola;
    myPassed = await Passed.find({studente : matricola})
    let mean = 0;
    for(let i = 0; i < myPassed.length; i++){
        mean += myPassed[i].voto;
    }
    mean = mean / myPassed.length;
    mean = mean.toFixed(2);
    req.app.locals.myPassed = myPassed;
    req.app.locals.mean = mean;
    res.render('passed');
}


module.exports = {
    passedGET
};
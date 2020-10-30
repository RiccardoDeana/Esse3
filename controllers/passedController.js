// controllers/passedController.js

const Passed = require('../models/passed');

// Renderizza la pagina con i voti registrati
// e calcola la media
async function passedGET (req, res) {
    try{
        const matricola = req.app.locals.matricola;
        const myPassed = await Passed.find({studente : matricola})
        let mean = 0;
        for(let i = 0; i < myPassed.length; i++){
            mean += myPassed[i].voto;
        }
        mean = mean / myPassed.length;
        mean = mean.toFixed(2);
        req.app.locals.myPassed = myPassed;
        req.app.locals.mean = mean;
        res.status(200).render('passed');
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    passedGET
};
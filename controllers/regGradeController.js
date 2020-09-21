const Passed = require('../models/passed');
const Registration = require('../models/registration');

function regGradeGET (req, res, next) {
    res.render('./regGrade');
}

function regGradePOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const dati = {
        "studente": req.body.studente,
        "esame": req.body.esame,
        "voto": req.body.voto,
        "lode": req.body.lode === 'on' ? true : false
    };
    Registration.find({studente:dati.studente, nomeEsame:dati.esame})
        .then(registrations => {
            if(registrations[0]){
                const passed = new Passed(dati);
                passed.save(function(err){
                    if(err){
                        const error = new Error('Dati incongruenti o voto già registrato');
                        error.status = 401;
                        return next(error);
                    }else{
                        Registration.deleteMany({studente:dati.studente, nomeEsame:dati.esame}, function (err) {
                            if(err){
                                return next(err)
                            }
                        });
                        res.redirect('/regGrade');
                    }
                });
            }else{
                const error = new Error('Lo studente non si è iscritto a questo esame');
                error.status = 401;
                return next(error);
            }
        }).catch(error => {
            return next(error);
        });
}

module.exports = {
    regGradeGET,
    regGradePOST
};
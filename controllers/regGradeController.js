const Passed = require('../models/passed');
const Registration = require('../models/registration');
const configError = require('../middleware/configError');

function regGradeGET (req, res) {
    res.render('./regGrade');
}

function regGradePOST (req, res) {
    if (!req.body) return res.sendStatus(400);
    const dati = {
        "studente": req.body.studente,
        "esame": req.body.esame,
        "voto": req.body.voto,
        "lode": req.body.lode === 'on'
    };
    Registration.find({studente:dati.studente, nomeEsame:dati.esame})
        .then(registrations => {
            if(registrations[0]){
                const passed = new Passed(dati);
                passed.save(function(err){
                    if(err){
                        configError('regGrade','Dati incongruenti o voto già registrato', res);
                    }else{
                        Registration.deleteMany({studente:dati.studente, nomeEsame:dati.esame}, function (err) {
                            if(err){
                                configError('regGrade',err, res);
                            }
                        });
                        res.redirect('/regGrade');
                    }
                });
            }else{
                configError('regGrade','Lo studente non si è iscritto a questo esame', res);
            }
        }).catch(error => {
        configError('regGrade',error, res);
        });
}

module.exports = {
    regGradeGET,
    regGradePOST
};
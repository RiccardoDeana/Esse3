const Passed = require('../models/passed');
const Registration = require('../models/registration');

function regGradeGET (req, res, next) {
    res.render('./regGrade');
}

function regGradePOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const dati = req.body;
    Registration.find({studente:dati.studente, nomeEsame:dati.esame})
        .then(registrations => {
            if(registrations){
                Registration.deleteMany({studente:dati.studente, nomeEsame:dati.esame}, function (err) {
                    if(err){
                        return next(err)
                    }
                    const passed = new Passed(dati);
                    passed.save(function(err){
                        if(err){
                            const error = new Error('Dati incongruenti');
                            error.status = 401;
                            return next(error);
                        }else{
                            res.redirect('/regGrade');
                        }
                    });
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
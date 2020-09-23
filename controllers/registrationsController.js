const Registration = require('../models/registration');
const Exam = require('../models/exam');

function registrationsGET (req, res, next) {
    const matricola = req.app.locals.matricola;
    Registration.find({studente: matricola})
        .then((registrations) => {
            req.app.locals.myRegistrations = registrations;
            res.render('registrations');
        })
        .catch(error => {
            next(error);
        });
}

function registrationsPOST (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const dati = req.body;
    const id = dati.id;
    Registration.findOne({_id:id})
        .then((registration) => {
            const date = new Date();
            if(registration){
                if(registration.data.getTime() > date.getTime()) {
                    Registration.deleteRegistration(id)
                        .then(() => {
                            res.redirect('/registrations');
                        })
                        .catch(error => {
                            return next(error)
                        });
                }else{
                    const error = new Error('Non è possibile annullare iscrizioni passate');
                    error.status = 401;
                    return next(error);
                }
            }else{
                const error = new Error('La prenotazione non esiste');
                error.status = 401;
                return next(error);
            }})
        .catch(error => {
                return next(error);
        })
}

module.exports = {
    registrationsGET,
    registrationsPOST
};
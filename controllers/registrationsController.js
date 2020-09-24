const Registration = require('../models/registration');
const configError = require('../middleware/configError');

function registrationsGET (req, res) {
    const matricola = req.app.locals.matricola;
    Registration.find({studente: matricola})
        .then((registrations) => {
            req.app.locals.myRegistrations = registrations;
            res.render('registrations');
        })
        .catch(error => {
            configError('registrations',error, res);
        });
}

function registrationsPOST (req, res) {
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
                            configError('registrations',error, res);
                        });
                }else{
                    configError('registrations','Non è possibile annullare iscrizioni passate', res);
                }
            }else{
                configError('registrations', 'La prenotazione non esiste', res);
            }})
        .catch(error => {
            configError('registrations', error, res);
        })
}

module.exports = {
    registrationsGET,
    registrationsPOST
};
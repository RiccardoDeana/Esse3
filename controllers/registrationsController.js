const Registration = require('../models/registration');
const configError = require('../middleware/configError');

async function registrationsGET (req, res) {
    const matricola = req.app.locals.matricola;
    registrations = await Registration.find({studente: matricola});
    req.app.locals.myRegistrations = registrations;
    res.render('registrations');
}

async function registrationsPOST (req, res) {
    const dati = req.body;
    const id = dati.id;
    registration = await Registration.findOne({_id:id});
    if(registration){
        const date = new Date();
        if(registration.data.getTime() > date.getTime()) {
            await Registration.deleteRegistration(id);
            res.redirect('/registrations');
        }else{
            configError('registrations','Non è possibile annullare iscrizioni passate', res);
        }
    }else{
        configError('registrations', 'La prenotazione non esiste', res);
    }
}

module.exports = {
    registrationsGET,
    registrationsPOST
};
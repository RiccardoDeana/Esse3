// controllers/registrationsController.js

const Registration = require('../models/registration');
const configError = require('../middleware/configError');

// Renderizza la pagina con le iscrizioni effettuate
async function registrationsGET (req, res) {
    const matricola = req.app.locals.matricola;
    const registrations = await Registration.find({studente: matricola}).sort({data: 'descending'});
    req.app.locals.myRegistrations = registrations;
    res.render('registrations');
}

// Annulla le iscrizioni
async function registrationsPOST (req, res) {
    const dati = req.body;
    const id = dati.id;
    const registration = await Registration.findOne({_id:id});
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
// controllers/registrationsController.js

const Registration = require('../models/registration');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina con le iscrizioni effettuate
async function registrationsGET (req, res) {
    try{
        const matricola = req.signedCookies.matricola;
        const nome = req.signedCookies.nome;
        const cognome = req.signedCookies.cognome;
        const registrations = await Registration.find({studente: matricola}).sort({data: 'descending'});
        res.status(200).render('registrations', {myRegistrations: registrations, nome: nome, cognome: cognome});
    }catch (error){
        res.status(400).send(error);
    }
}

// Annulla le iscrizioni
async function registrationsPOST (req, res) {
    try{
        const dati = req.body;
        const id = dati.id;
        const registration = await Registration.findOne({_id:id});
        if(registration){
            const date = new Date();
            if(registration.data.getTime() > date.getTime()) {
                await Registration.deleteRegistration(id);
                successRedirect('registrations', 'Iscrizione annullata', req, res);
            }else{
                errorRedirect('registrations', 'Non è possibile annullare iscrizioni passate', req, res);
            }
        }else{
            errorRedirect('registrations', 'La prenotazione non esiste', req, res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    registrationsGET,
    registrationsPOST
};
// controllers/regGradeController.js

const Passed = require('../models/passed');
const Registration = require('../models/registration');
const errorRedirect = require('../messages/errorRedirect');
const successRedirect = require('../messages/successRedirect');

// Renderizza la pagina per registrare un voto
async function regGradeGET (req, res) {
    try{
        const nome = req.signedCookies.nome;
        const cognome = req.signedCookies.cognome;
        res.status(200).render('regGrade', {nome: nome, cognome: cognome});
    }catch (error){
        res.status(400).send(error);
    }
}

// Registra un voto
// controllando che lo studente sia iscritto all'esame
// e che il voto sia valido e non già registrato
async function regGradePOST (req, res) {
    try{
        const dati = {
            "studente": req.body.studente,
            "esame": req.body.esame.toUpperCase(),
            "voto": req.body.voto,
            "lode": req.body.lode === 'on'
        };
        const registrations = await Registration.find({studente:dati.studente, nomeEsame:dati.esame});
        if(registrations[0]){
            const passed = new Passed(dati);
            await passed.save(async function(err){
                if(err){
                    errorRedirect('regGrade','Dati incongruenti o voto già registrato', res);
                }else{
                    await Registration.deleteMany({studente:dati.studente, nomeEsame:dati.esame}, function (err) {
                        if(err){
                            errorRedirect('regGrade', err, req, res);
                        }
                    });
                    successRedirect('regGrade','Voto registrato', req, res);
                }
            });
        }else{
            errorRedirect('regGrade','Lo studente non si è iscritto a questo esame', req, res);
        }
    }catch (error){
        res.status(400).send(error);
    }
}

module.exports = {
    regGradeGET,
    regGradePOST
};
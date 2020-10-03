// controllers/regGradeController.js

const Passed = require('../models/passed');
const Registration = require('../models/registration');
const configError = require('../middleware/configError');
const configSuccess = require('../middleware/configSuccess');

// Renderizza la pagina per registrare un voto
async function regGradeGET (req, res) {
    try{
        res.render('./regGrade');
    }catch (error){
        console.log(error);
    }
}

// Registra un voto
// controllando che lo studente sia iscritto all'esame
// e che il voto sia valido e non già registrato
async function regGradePOST (req, res) {
    try{
        const dati = {
            "studente": req.body.studente,
            "esame": req.body.esame,
            "voto": req.body.voto,
            "lode": req.body.lode === 'on'
        };
        const registrations = await Registration.find({studente:dati.studente, nomeEsame:dati.esame});
        if(registrations[0]){
            const passed = new Passed(dati);
            await passed.save(async function(err){
                if(err){
                    configError('regGrade','Dati incongruenti o voto già registrato', res);
                }else{
                    await Registration.deleteMany({studente:dati.studente, nomeEsame:dati.esame}, function (err) {
                        if(err){
                            configError('regGrade',err, res);
                        }
                    });
                    configSuccess('regGrade','Voto registrato', res);
                }
            });
        }else{
            configError('regGrade','Lo studente non si è iscritto a questo esame', res);
        }
    }catch (error){
        console.log(error);
    }
}

module.exports = {
    regGradeGET,
    regGradePOST
};
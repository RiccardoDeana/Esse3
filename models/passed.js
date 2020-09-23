const mongoose = require('mongoose');

const passedSchema = mongoose.Schema({
        esame: {
            type: String,
            required: true,
            trim: true
        },
        studente: {
            type: Number,
            required: true,
            trim: true
        },
        voto: {
            type: Number,
            required: true,
            min: 18,
            max: 30,
            trim: true
        },
        lode:  {
            type: Boolean,
            required: true,
            validate: {
                validator: function(){
                    return !(this.lode == true && this.voto != 30);
                }
            }
        }
    },
    {
        collection: 'superati'
    });

passedSchema.index({esame: 1, studente: 1}, {unique: true});

const Passed = mongoose.model('Passed', passedSchema);

module.exports = Passed;
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    
});

appointmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Appointment', appointmentSchema);
const HttpError = require('../models/http-error');
const Appointment = require('../models/appointment');

exports.getAllAppointments = async (req, res, next) => {
    let appointments;
    try {
        appointments = await Appointment.find();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not get appointments', 500));   
    }
    
    res.status(200).json({appointments: appointments.map(appointment => appointment.toObject({ getters: true }))});
}

exports.createAppointment = async (req, res, next) => {
    const { 
        doctorId,
        patientId,
        doctorName,
        patientName,
        phoneNo,
        email,
        date,
        time,
        diagnosis,
        Pescription 
    } = req.body;
    const createdAppointment = new Appointment({
        doctorId,
        patientId,
        doctorName,
        patientName,
        phoneNo,
        email,
        date,
        time,
        diagnosis,
        Pescription
    });
    try {
        await createdAppointment.save();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not create appointment', 500));
    }
    res.status(201).json({ appointment: createdAppointment.toObject({ getters: true }) });
};

exports.addPescription = async (req, res, next) => {
    if(req.userData.type!=="patient"){
        return next(new HttpError('You are not authorized to perform this action', 401));
    }

    const { id } = req.params;
    const { Pescription } = req.body;

    let appointment;
    try {
        appointment = await Appointment.findById(id);
    } catch (error) {
        return next(new HttpError('Something went wrong, could not add Pescription', 500));
    }
    appointment.Pescription = Pescription;
    try {
        await appointment.save();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not add Pescription', 500));
    }
    res.status(200).json({ appointment: appointment.toObject({ getters: true }) });
};

exports.deleteAppointment = async (req, res, next) => {
    const { id } = req.params;
    let appointment;
    try {
        appointment = await Appointment.findById(id);
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete appointment', 500));
    }
    try {
        await appointment.remove();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete appointment', 500));
    }
    res.status(200).json({ message: 'Appointment deleted' });
}
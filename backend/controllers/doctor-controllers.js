const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Doctor = require('../models/doctor');


exports.signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data',
                422
            )
        );
    }
    // console.log(req.files[0].path);
    // console.log(req.files[1].path);
    // console.log(req.files[2].path);
    const {
        name,
        gender,
        phoneNo,
        email,
        password,
        medicalId,
        specializations,
        qualifications,
        workplaces
    } = req.body;

    let existingDoctor;
    try {
        existingDoctor = await Doctor.findOne({ email: email });
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError(
                'Signup failed, please try again later',
                500
            )
        );
    }
    if (existingDoctor) {
        return next(
            new HttpError(
                'User already exists, please login',
                422
            )
        );
    }


    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        console.log(error.message);
        return next(new HttpError("Could not create user, please try again", 500));
    }

    const createdDoctor = new Doctor({
        name,
        gender,
        phoneNo,
        email,
        password: hashedPassword,
        profileImage: req.files[0].path,
        medicalId,
        licenseFront: req.files[1].path,
        licenseBack: req.files[2].path,
        specializations: JSON.parse(specializations),
        qualifications: JSON.parse(qualifications),
        workplaces: JSON.parse(workplaces),
        appointments: [],
        blogs: []
    });
    try {
        await createdDoctor.save();
    } catch (error) {
        console.log(error.message);
        return next(new HttpError("Signup failed, please try again later", 500));
    }

    let token;
    try {
        token = jwt.sign(
            {
                id: createdDoctor.id,
                email: createdDoctor.email,
                type: "doctor",
            },
            process.env.JWT_KEY,
            {
                expiresIn: "6d",
            }
        );
    } catch (error) {
        console.log(error.message);
        return next(new HttpError("Signup failed, please try again later", 500));
    }
    console.log({token : token});
    res.status(201).json({
        id: createdDoctor.id,
        name: createdDoctor.name,
        email: createdDoctor.email,
        token: token,
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingDoctor;
    try {
        existingDoctor = await Doctor.findOne({ email: email });
    } catch (error) {
        return next(
            new HttpError("Logging in failed, please try again later.", 500)
        );
    }
    if (!existingDoctor) {
        return next(
            new HttpError("Invalid credentials, could not log you in.", 401)
        );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingDoctor.password);
    } catch (error) {
        return next(new HttpError("Could not log you in.Please try again", 401));
    }
    if (!isValidPassword) {
        return next(
            new HttpError("Invalid credentials, could not log you in.", 401)
        );
    }

    let token;
    try {
        token = jwt.sign(
            {
                id: existingDoctor.id,
                email: existingDoctor.email,
                type: "doctor",
            },
            process.env.JWT_KEY,
            {
                expiresIn: "6d",
            }
        );
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError("Logging in failed, please try again later.", 500)
        );
    }
    console.log({token : token});

    res.status(201).json({
        id: existingDoctor.id,
        email: existingDoctor.email,
        name: existingDoctor.name,
        token: token,
    });
};

exports.getProfile = async (req, res, next) => {
    const doctorId = req.params.id;
    let doctor;
    try {
        doctor = await Doctor.findById(doctorId);
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not get doctor.",
                500
            )
        );
    }
    if (!doctor) {
        return next(
            new HttpError(
                "Could not find doctor.",
                404
            )
        );
    }
    res.status(200).json({ doctor: doctor.toObject({ getters: true }) });
    
}    

exports.editInfo = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError(
                "Invalid inputs",
                422
            ));
    }

    const doctorId = req.params.doctorId;
    const { phoneNo, password, specializations, qualifications, workplaces } =
        req.body;

    let updatedDoctor;
    try {
        updatedDoctor = await Doctor.findById(doctorId);
    }
    catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not update information.",
                500
            )
        );
    }
    if (!updatedDoctor) {
        return next(
            new HttpError(
                "Something went wrong, could not update information.",
                500
            )
        );
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, updatedDoctor.password);
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not update information.",
                500
            )
        );
    }
    if (!isValidPassword) {
        return next(
            new HttpError(
                "Invalid password, could not update info.",
                401
            )
        );
    }
    updatedDoctor.phoneNo = phoneNo;
    updatedDoctor.specializations = specializations;
    updatedDoctor.qualifications = qualifications;
    updatedDoctor.workplaces = workplaces;
    try {
        await updatedDoctor.save();
    } catch (error) {
        console.log(error);
        return next(
            new HttpError(
                "Something went wrong, could not update information",
                500
            )
        );
    }
    res.status(200).json({ doctor: updatedDoctor.toObject({ getters: true }) });
};

exports.changePassword = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError(
                "Invalid inputs",
                422
            )
        );
    }
    const doctorId = req.params.doctorId;
    const { oldPassword, newPassword } = req.body;

    let updatedDoctor;
    try {
        updatedDoctor = await Doctor.findById(doctorId);
    } catch (error) {
        return next(
            new HttpError("Something went wrong, could not update password.", 500)
        );
    }

    if (!updatedDoctor) {
        return next(
            new HttpError(
                "Something went wrong, could not update information.",
                500
            )
        );
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(oldPassword, updatedDoctor.password);
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not update password.",
                500
            )
        );
    }
    if (!isValidPassword) {
        return next(
            new HttpError(
                "Invalid password, could not update password.",
                401
            )
        );
    }
    if (newPassword === oldPassword) {
        return next(
            new HttpError(
                "Old password and new password are same, could not update password.",
                401
            )
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError("Something went wrong, could not update password.", 500)
        );
    }

    updatedDoctor.password = hashedPassword;
    try {
        await updatedDoctor.save();
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Something went wrong, could not update password.", 500)
        );
    }
    res.status(200).json({ doctor: updatedDoctor.toObject({ getters: true }) });
};

exports.getDoctors = async (req, res, next) => {
    const { doctorName, speciality } = req.query;
    let doctors;
    try {
        doctors = await Doctor.find();
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not get doctors.",
                500
            )
        );
    }
    if (!doctors) {
        return next(
            new HttpError(
                "Could not find any doctors.",
                404
            )
        );
    }
    let filteredDoctors;
    if (doctorName && speciality) {
        filteredDoctors = doctors.filter(doctor => doctor.name.toLowerCase().includes(doctorName.toLowerCase())
            && doctor.specializations.some(s => s.toLowerCase().includes(speciality.toLowerCase())))
    } else if (doctorName) {
        filteredDoctors = doctors.filter(doctor => doctor.name.toLowerCase().includes(doctorName.toLowerCase()))
    } else if (speciality) {
        filteredDoctors = doctors.filter(doctor => doctor.specializations.some(s => s.toLowerCase().includes(speciality.toLowerCase())))
    } else {
        filteredDoctors = doctors;
    }
    res.status(200).json({ doctors: filteredDoctors.map(doctor => doctor.toObject({ getters: true })) });
};

exports.getDoctor = async (req, res, next) => {
    const doctorId = req.params.doctorId;
    let doctor;
    try {
        doctor = await Doctor.findById(doctorId);
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not get doctor.",
                500
            )
        );
    }
    if (!doctor) {
        return next(
            new HttpError(
                "Could not find doctor.",
                404
            )
        );
    }
    res.status(200).json({ doctor: doctor.toObject({ getters: true }) });
};

exports.getAllAppointments = async (req, res, next) => {
    const doctorId = req.params.id ? req.params.id : req.userData.id;
    let doctor;
    let detailedAppointmentStat;
    try {
        doctor = await Doctor.findById(doctorId).populate('appointments');
        detailedAppointmentStat = await doctor.appointments.map(appointment => {
            appointment.toObject({ getters: true })
        });
    } catch (error) {
        next(new HttpError("Something went wrong, could not get appointments.", 500));
    }
    
    res.status(200).json({
        data: {
            doctor: doctor.toObject({ getters: true }),
            detailedAppointmentStat
        }
    });
}


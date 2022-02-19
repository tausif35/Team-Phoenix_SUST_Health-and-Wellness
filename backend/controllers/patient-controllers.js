const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Patient = require("../models/patient");
// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');

exports.signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  // console.log(req.files[0].path);
  const { name, dateOfBirth, email, password, gender, phoneNo } = req.body;

  let existingPatient;
  try {
    existingPatient = await Patient.findOne({ email: email });
  } catch (error) {
    console.log(error.message);
    return next(new HttpError("Signup failed, please try again later", 500));
  }
  if (existingPatient) {
    return next(new HttpError("User already exists, please login", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error.message);
    return next(new HttpError("Could not create user, please try again", 500));
  }
  // console.log(req.file.path);
  const createdPatient = new Patient({
    name,
    dateOfBirth,
    email,
    gender,
    password: hashedPassword,
    phoneNo,
    profileImage: req.files[0].path,
    appointments: [],
    questions: [],
  });
  try {
    await createdPatient.save();
  } catch (error) {
    console.log(error.message);
    return next(new HttpError("Signup failed, please try again later", 500));
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: createdPatient.id,
        email: createdPatient.email,
        type: "patient",
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
  console.log({ token: token });

  res.status(201).json({
    id: createdPatient.id,
    name: createdPatient.name,
    email: createdPatient.email,
    token: token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingPatient;
  try {
    existingPatient = await Patient.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }
  if (!existingPatient) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingPatient.password);
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
        id: existingPatient.id,
        email: existingPatient.email,
        type: "patient",
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

  res.status(201).json({
    id: existingPatient.id,
    email: existingPatient.email,
    name: existingPatient.name,
    token: token,
  });
};

exports.getProfile = async (req, res, next) => {
    const patientId = req.params.id;
    let patient;
    try {
        patient = await Patient.findById(patientId);
    } catch (error) {
        console.log(error.message);
        return next(
        new HttpError("Something went wrong, could not find patient.", 500)
        );
    }
    if (!patient) {
        return next(
        new HttpError("Something went wrong, could not find patient.", 500)
        );
    }
    res.status(200).json({ patient: patient.toObject({ getters: true }) });
};

exports.editInfo = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }

  const patientId = req.params.patientId;
  const { phoneNo, password } = req.body;
  let updatedPatient;
  try {
    updatedPatient = await Patient.findById(patientId);
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError("Something went wrong, could not update information.", 500)
    );
  }
  if (!updatedPatient) {
    return next(
      new HttpError("Something went wrong, could not update information.", 500)
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, updatedPatient.password);
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError("Something went wrong, could not update information.", 500)
    );
  }
  if (!isValidPassword) {
    return next(new HttpError("Invalid password, could not update info.", 401));
  }
  updatedPatient.phoneNo = phoneNo;
  try {
    await updatedPatient.save();
  } catch (error) {
    // console.log(error);
    return next(
      new HttpError("Something went wrong, could not update information", 500)
    );
  }
  res.status(200).json({ patient: updatedPatient.toObject({ getters: true }) });
};

exports.changePassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }

  const patientId = req.params.patientId;
  const { oldPassword, newPassword } = req.body;

  let updatedPatient;
  try {
    updatedPatient = await Patient.findById(patientId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update password.", 500)
    );
  }
  if (!updatedPatient) {
    return next(
      new HttpError("Something went wrong, could not update information.", 500)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      oldPassword,
      updatedPatient.password
    );
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update password.", 500)
    );
  }
  if (!isValidPassword) {
    return next(
      new HttpError("Invalid password, could not update password.", 401)
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

  updatedPatient.password = hashedPassword;
  try {
    await updatedPatient.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not update password.", 500)
    );
  }
  res.status(200).json({ patient: updatedPatient.toObject({ getters: true }) });
};

exports.getAllAppointments = async (req, res, next) => {
  let patient;
  try {
    patient = await Patient.findById(req.userData.id).populate("appointments");
  } catch (error) {
    next(
      new HttpError("Something went wrong, could not get appointments.", 500)
    );
  }
  const detailedAppointmentStat = await patient.appointments.map(
    (appointment) => {
      appointment.toObject({ getters: true });
    }
  );
  res.status(200).json({
    data: {
      patient: patient.toObject({ getters: true }),
      detailedAppointmentStat,
    },
  });
};

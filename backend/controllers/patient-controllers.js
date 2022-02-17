const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');


const signup = async (req, res, next) => {
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
  const {
    name,
    dateOfBirth,
    email,
    password,
    gender,
    phoneNo
  } = req.body;

  let existingPatient;
  try {
    existingPatient = await Patient.findOne({ email: email });
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        'Signup failed, please try again later',
        500
      )
    );
  }
  if (existingPatient) {
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
    return next(
      new HttpError(
        'Could not create user, please try again',
        500
      )
    );
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
    questions: []
  });
  try {
    await createdPatient.save();
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        'Signup failed, please try again later',
        500
      )
    );
  }


  let token;
  try {
    token = jwt.sign(
      {
        id: createdPatient.id,
        email: createdPatient.email,
        type: "patient"
      },
      process.env.JWT_KEY,
      {
        expiresIn: '2h'
      }
    );
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        'Signup failed, please try again later',
        500
      )
    );
  }

  res.status(201).json({
    id: createdPatient.id,
    name: createdPatient.name,
    email: createdPatient.email,
    token: token
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingPatient;
  try {
    existingPatient = await Patient.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        "Logging in failed, please try again later.",
        500
      )
    );
  }
  if (!existingPatient) {
    return next(
      new HttpError(
        "Invalid credentials, could not log you in.",
        401
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingPatient.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in.Please try again",
        401
      )
    );
  }
  if (!isValidPassword) {
    return next(
      new HttpError(
        "Invalid credentials, could not log you in.",
        401
      )
    );
  }

  // const age = ageCalculator.getAge(existingPatient.dateOfBirth);

  let token;
  try {
    token = jwt.sign(
      {
        id: existingPatient.id,
        email: existingPatient.email,
        type: "patient"
      },
      process.env.JWT_KEY,
      {
        expiresIn: '2h'
      }
    );
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        "Logging in failed, please try again later.",
        500
      )
    );
  }

  res.status(201).json({
    id: existingPatient.id,
    email: existingPatient.email,
    name: existingPatient.name,
    token: token
  });

};

const editInfo = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs",
        422
      ));
  }

  const patientId = req.params.patientId;
  const {
    phoneNo,
    password,
  } = req.body;
  let updatedPatient;
  try {
    updatedPatient = await Patient.findById(patientId);
  }
  catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        "Something went wrong, could not update information.",
        500
      )
    );
  }
  if (!updatedPatient) {
    return next(
      new HttpError(
        "Something went wrong, could not update information.",
        500
      )
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, updatedPatient.password);
  } catch (error) {

    console.log(error.message);
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
  updatedPatient.phoneNo = phoneNo;
  try {
    await updatedPatient.save();
  } catch (error) {
    // console.log(error);
    return next(
      new HttpError(
        "Something went wrong, could not update information",
        500
      )
    );
  }
  res.status(200).json({ patient: updatedPatient.toObject({ getters: true }) });
};

const changePassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs",
        422
      )
    );
  }

  const patientId = req.params.patientId;
  const {
    oldPassword,
    newPassword,
  } = req.body;

  let updatedPatient;
  try {
    updatedPatient = await Patient.findById(patientId);
  }
  catch (error) {
    return next(
      new HttpError(
        "Something went wrong, could not update password.",
        500
      )
    );
  }
  if (!updatedPatient) {
    return next(
      new HttpError(
        "Something went wrong, could not update information.",
        500
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, updatedPatient.password);
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
      new HttpError(
        "Something went wrong, could not update password.",
        500
      )
    );
  }

  updatedPatient.password = hashedPassword;
  try {
    await updatedPatient.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Something went wrong, could not update password.",
        500
      )
    );
  }
  res.status(200).json({ patient: updatedPatient.toObject({ getters: true }) });
};

const getDoctors = async (req, res, next) => {
  const { doctorName, speciality } = req.body;
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

const getDoctor = async (req, res, next) => {
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



exports.signup = signup;
exports.login = login;
exports.editInfo = editInfo;
exports.changePassword = changePassword;
exports.getDoctors = getDoctors;
exports.getDoctor = getDoctor;
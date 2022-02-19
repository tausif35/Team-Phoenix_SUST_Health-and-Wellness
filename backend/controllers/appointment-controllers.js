const HttpError = require("../models/http-error");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const mongoose = require("mongoose");

const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generatePrescription(appointment) {
  // Create a new document and add a new page
  const prescStorage = path.join(__dirname, "../", "public", "uploads");
  const templateStorage = path.join(
    prescStorage,
    "../",
    "prescriptions",
    "template",
    "form.pdf"
  );
  let myFile = fs.readFileSync(templateStorage);

  const pdfDoc = await PDFDocument.load(myFile);

  const form = pdfDoc.getForm();

  // Get all fields in the PDF by their names
  const professionalField = form.getTextField("doctorName");
  const dateField = form.getTextField("date");
  const patientField = form.getTextField("patientName");
  const ageField = form.getTextField("patientAge");
  const diagnosisField = form.getTextField("diagnosis");
  const testsField = form.getTextField("tests");
  const adviceField = form.getTextField("advice");

  // Fill in the basic info fields
  professionalField.setText("Mario");
  dateField.setText("24/11/2021");
  ageField.setText("24 years");
  patientField.setText("Nihal");

  diagnosisField.setText(appointment.diagnosis);
  testsField.setText(appointment.tests);
  adviceField.setText(appointment.advice);

  form.flatten();
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = pdfDoc.save();
  //Write the PDF to a file
  fs.writeFileSync(
    prescStorage + `/${appointment.id}_prescription.pdf`,
    await pdfDoc.save()
  );
}

const timeSlots = require("../utils/timeSlots");

exports.getAllAppointments = async (req, res, next) => {
  let appointments;
  try {
    appointments = await Appointment.find().populate("doctorId");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not get appointments", 500)
    );
  }

  res.status(200).json({
    appointments: appointments.map((appointment) =>
      appointment.toObject({ getters: true })
    ),
  });
};

exports.createAppointment = async (req, res, next) => {
  const { doctorId, patientId, title, timeStamp, date, time } = req.body;
  const createdAppointment = new Appointment({
    doctorId,
    patientId,
    title,
    timeStamp,
    date,
    time,
  });
  try {
    const doctor = await Doctor.findById(doctorId);
    let patient;
    patient = await Patient.findById(patientId);
    if (!doctor || !patient) {
      throw new HttpError(
        "Could not find doctor or patient for this appointment",
        404
      );
    }
    let session;
    session = await mongoose.startSession();
    session.startTransaction();
    await createdAppointment.save({ session: session });
    doctor.appointments.push(createdAppointment);
    await doctor.save({ session: session });
    patient.appointments.push(createdAppointment);
    await patient.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError("Something went wrong, could not create appointment", 500)
    );
  }
  res.status(201).json({
    appointment: createdAppointment.toObject({ getters: true }),
  });
};

exports.addPescriptionInfo = async (req, res, next) => {
  if (req.userData.type === "patient") {
    return next(
      new HttpError("You are not authorized to perform this action", 401)
    );
  }
  const { id } = req.params;
  const { diagnosis, tests, advice } = req.body;
  let appointment;
  try {
    appointment = await Appointment.findById(id);
    console.log(appointment);
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        "Something went wrong, could not add Pescription Information",
        500
      )
    );
  }
  // if (req.userData.id !== appointment.doctorId.toString()) {
  //   return next(
  //     new HttpError(
  //       "Something went wrong, could not add Pescription Information",
  //       500
  //     )
  //   );
  // }
  appointment.diagnosis = diagnosis;
  appointment.tests = tests;
  appointment.advice = advice;
  try {
    await appointment.save();
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError(
        "Something went wrong, could not add Pescription Information",
        500
      )
    );
  }
  res
    .status(200)
    .json({ appointment: appointment.toObject({ getters: true }) });
};

exports.getPrescription = async (req, res, next) => {
  const { id } = req.params;
  let appointment;
  try {
    appointment = await Appointment.findById(id);
  } catch (error) {
    return next(
      new HttpError(
        "Something went wrong, could not download prescription",
        500
      )
    );
  }
  if (!appointment) {
    return next(new HttpError("Could not find appointment for this id", 404));
  }

  generatePrescription(appointment).catch((err) => console.log(err));

  res.status(200).json({
    filePath: `public/uploads/${appointment.id}_prescription.pdf`,
  });

  res.status(200).json({
    diagnosis: appointment.diagnosis,
    tests: appointment.tests,
    advice: appointment.advice,
  });

  //   res.status(200).json({ diagnosis: appointment.diagnosis, tests: appointment.tests, advice: appointment.advice });
};

exports.cancelAppointment = async (req, res, next) => {
  const { id } = req.params;
  let appointment;
  try {
    appointment = await Appointment.findById(id)
      .populate("doctorId")
      .populate("patientId");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete appointment", 500)
    );
  }
  if (!appointment) {
    return next(new HttpError("Could not find appointment for this id", 404));
  }
  const doctor = appointment.doctorId.id;
  const patient = appointment.patientId.id;
  const user = req.userData.id;
  if (user !== doctor && user !== patient) {
    return next(
      new HttpError("You are not authorized to perform this action", 401)
    );
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await appointment.remove({ session: session });
    appointment.doctorId.appointments.pull(appointment);
    await appointment.doctorId.save({ session: session });
    appointment.patientId.appointments.pull(appointment);
    await appointment.patientId.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error.message);
    return next(
      new HttpError("Something went wrong, could not create appointment", 500)
    );
  }
  res.status(200).json({ message: "Appointment deleted" });
};

exports.getAppointmentSlots = async (req, res, next) => {
  const { doctorId, date } = req.body;
  let doctor;
  try {
    doctor = await Doctor.findById(doctorId).populate("appointments");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not get doctor", 500)
    );
  }
  if (!doctor) {
    return next(new HttpError("Could not find doctor for this id", 404));
  }
  let times = [];
  let today = new Date();
  let dt =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const nowDate = dt.toString();
  if (date !== nowDate) {
    for (let i = 0; i < doctor.appointments.length; i++) {
      if (doctor.appointments[i].date === date) {
        times.push(doctor.appointments[i].time);
      }
    }
  }
  // console.log(times);
  slots = timeSlots.getSlots(times);
  res.status(200).json({
    times: slots,
  });
};

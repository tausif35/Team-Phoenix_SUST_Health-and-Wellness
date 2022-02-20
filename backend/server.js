// imports
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const qnaRoutes = require("./routes/qnaRoutes");
const blogRoutes = require("./routes/blogRoutes");
const doctorRoutes = require("./routes/doctor-routes");
const patientRoutes = require("./routes/patient-routes");
const generalRoutes = require("./routes/general-routes");
const appointmentRoutes = require("./routes/appointment-routes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

//logger middleware
// app.use(morgan("tiny"));

app.use("/public/uploads", express.static(path.join("public", "uploads")));

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/QnA", qnaRoutes);
app.use("/api", generalRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  if (req.files) {
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || `An unknown error occured` });
});

// server start
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to the server on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err.message));

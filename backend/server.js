// imports
require("dotenv").config();
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
const errorHandlar = require("./controllers/errorController");

const app = express();
const port = process.env.PORT || 5000;

// Cross-Origin Resource Sharing middleware
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      credentials: true,
    })
  );
app.use(bodyParser.json());

//logger middleware
app.use(morgan("tiny"));

app.use("/public/uploads", express.static(path.join("public", "uploads")));

app.use("/api", generalRoutes);
app.use("/api/QnA", qnaRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

app.use(errorHandlar);

// server start
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to the server on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err.message));

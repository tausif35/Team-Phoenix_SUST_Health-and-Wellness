// imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const HttpError = require('./models/http-error');
const patientRoutes = require('./routes/patient-routes');
const doctorRoutes = require('./routes/doctor-routes');
const qnaRoutes = require('./routes/qnaRoutes');
const generalRoutes = require('./routes/general-routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
app.use('/public/uploads', express.static(path.join('public', 'uploads')));

app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/QnA', qnaRoutes);
app.use('/api', generalRoutes);
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  if (req.files) {
    req.files.forEach(file => {
      fs.unlink(file.path, err => {
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
  res.json({ message: err.message || `An unknown error occured` })
});

// server start
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening to the server on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err.message));

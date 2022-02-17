const express = require('express');

const route = express.Router();

const appointmentController = require('../controllers/appointment-controllers');
const checkAuth = require('../middleware/check-auth');
const router = require('./patient-routes');

router.use(checkAuth);

router.get('/', appointmentController.getAllAppointments);

router.post('/', appointmentController.createAppointment);

router.patch('/:id', appointmentController.addPescription);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = route;
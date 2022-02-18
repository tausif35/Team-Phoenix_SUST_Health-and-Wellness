const express = require('express');

const router = express.Router();

const appointmentController = require('../controllers/appointment-controllers');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', appointmentController.getAllAppointments);

router.post('/', appointmentController.createAppointment);

router.patch('/:id', appointmentController.addPescription);
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
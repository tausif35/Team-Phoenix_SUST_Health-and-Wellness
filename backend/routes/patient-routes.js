const express = require('express');

const router = express.Router();

const patientControllers = require('../controllers/patient-controllers');
const checkAuth = require('../middleware/check-auth');
const filesUpload = require('../middleware/file-upload');
const chatController = require('../controllers/chatController');

router.post(
    '/signup',
    filesUpload.array('image'),
    patientControllers.signup);

router.post('/login', patientControllers.login);

router.use(checkAuth);

router.patch('/:patientId', patientControllers.editInfo);

router.put('/:patientId', patientControllers.changePassword);

router.get('/appointments', patientControllers.getAllAppointments);

// id of doctor
router.get("/chatInfo/:id", chatController.getChatInfo);

module.exports = router;
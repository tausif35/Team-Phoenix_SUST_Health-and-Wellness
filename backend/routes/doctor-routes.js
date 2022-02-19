const express = require('express');

const router = express.Router();

const doctorControllers = require('../controllers/doctor-controllers');
const checkAuth = require('../middleware/check-auth');
const filesUpload = require('../middleware/file-upload');
const chatController = require('../controllers/chatController');

// "api/doctors/signup"
router.post(
    '/signup', 
    filesUpload.array('image'),
    doctorControllers.signup);

// "api/doctors/login"
router.post('/login', doctorControllers.login);


// "api/doctors/profile/:doctorId"
router.get('/profile/:id', doctorControllers.getProfile);

// token is required
router.use(checkAuth);

// "api/doctors/:doctorId"
router.patch('/:doctorId', doctorControllers.editInfo);

// "api/doctors/:doctorId"
router.put('/:doctorId', doctorControllers.changePassword);

// get doctors by specializations or name or both
router.get('/find', doctorControllers.getDoctors); 


// get doctors by id
router.get('/find/:doctorId', doctorControllers.getDoctor);

// get current user appontments
router.get('/appointments', doctorControllers.getAllAppointments);

// get current user appontments
router.get('/:id', doctorControllers.getAllAppointments);

// id of patient
router.get("/chatInfo/:id", chatController.getChatInfo);

module.exports = router;
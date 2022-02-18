const express = require('express');

const router = express.Router();

const doctorControllers = require('../controllers/doctor-controllers');
const checkAuth = require('../middleware/check-auth');
const filesUpload = require('../middleware/file-upload');

router.post(
    '/signup', 
    filesUpload.array('image'),
    doctorControllers.signup);


router.post('/login', doctorControllers.login);

router.use(checkAuth);

router.patch('/:doctorId', doctorControllers.editInfo);

router.put('/:doctorId', doctorControllers.changePassword);

// get doctors by specializations or name or both
router.get('/find', doctorControllers.getDoctors); 


// get doctors by id
router.get('/find/:doctorId', doctorControllers.getDoctor);

router.get('/appointments', doctorControllers.getAllAppointments);

router.get('/:id', doctorControllers.getAllAppointments);

module.exports = router;
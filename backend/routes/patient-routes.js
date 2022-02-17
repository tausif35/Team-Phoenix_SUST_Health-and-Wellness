const express = require('express');

const router = express.Router();

const patientControllers = require('../controllers/patient-controllers');
const checkAuth = require('../middleware/check-auth');
const filesUpload = require('../middleware/file-upload');

router.post(
    '/signup',
    filesUpload.array('image'),
    patientControllers.signup);

router.post('/login', patientControllers.login);

router.use(checkAuth);

router.patch('/:patientId', patientControllers.editInfo);

router.put('/:patientId', patientControllers.changePassword);

// get doctors by specializations or name or both
router.get('/findDoctors', patientControllers.getDoctors); 

router.get('/findDoctors/:doctorId', patientControllers.getDoctor);

module.exports = router;
const express = require('express');

const router = express.Router();

const patientControllers = require('../controllers/patient-controllers');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', patientControllers.signup);

router.post('/login', patientControllers.login);

router.use(checkAuth);

router.patch('/:patientId', patientControllers.editInfo);

router.put('/:patientId', patientControllers.changePassword);

module.exports = router;
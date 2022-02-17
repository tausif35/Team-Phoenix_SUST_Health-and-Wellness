const express = require('express');

const router = express.Router();

const doctorControllers = require('../controllers/doctor-controllers');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', doctorControllers.signup);


router.post('/login', doctorControllers.login);

router.use(checkAuth);

router.patch('/:doctorId', doctorControllers.editInfo);

router.put('/:doctorId', doctorControllers.changePassword);

module.exports = router;
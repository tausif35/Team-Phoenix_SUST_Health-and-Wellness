const express = require('express');


const generalControllers = require('../controllers/general-controllers');

const router = express.Router();

router.get('/drugs', generalControllers.getDrug);

module.exports = router;
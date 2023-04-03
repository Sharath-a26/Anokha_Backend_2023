const express = require('express');
const router = express.Router();

const userWebController = require('../controller/userWebController');

router.get('/events/all', userWebController.getAllEvents);

module.exports = router;
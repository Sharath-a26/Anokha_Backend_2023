const express = require('express');
const router = express.Router();

const userWebController = require('../controller/userWebController');

router.get('/events/all', userWebController.getAllEvents);
router.post('/login', userWebController.userLogin);

module.exports = router;



const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/events/groupByDepartment',userController.getEventsByDepartment);
router.get('/getUser/:userEmail',userController.getUserDetails)
router.get('/login/:userEmail/:password', userController.userLogin)

module.exports = router;
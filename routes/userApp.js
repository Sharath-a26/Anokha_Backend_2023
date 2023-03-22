const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/events/groupByDepartment',userController.getEventsByDepartment);

router.get('/getUser/:userEmail',userController.getUserDetails);


router.post('/editUser/:userEmail',controller.editUserDetails)

module.exports = router;
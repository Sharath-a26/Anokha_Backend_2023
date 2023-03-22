const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/events/groupByDepartment',userController.getEventsByDepartment);
router.post('/editUser/:userEmail',userController.editUserDetails)
router.get('/getUser/:userEmail',userController.getUserDetails)
router.post('/login', userController.userLogin)


module.exports = router;
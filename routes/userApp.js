const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/events/groupByDepartment',userController.getEventsByDepartment);
router.post('/editUser',userController.editUserDetails);
router.get('/getUser/:userEmail',userController.getUserDetails);
router.post('/login', userController.userLogin);
router.post('/registerUser', userController.registerUser);
router.post('/verifyOTP', userController.verifyOTP);

router.post('/insertStarrs',userController.insertStarredEvent);
router.post('/dropStarrs',userController.dropStarredEvent);
router.get('/getStarredEvents/:userEmail',userController.getStarredEvents);
router.get('/getCrew/:teamName',userController.getCrewDetails);
router.get('/getCrew',controller.getCrewDetails)

module.exports = router;
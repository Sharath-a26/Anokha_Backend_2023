const express = require('express');
const router = express.Router();

const userWebController = require('../controller/userWebController');

//getting all events
router.get('/events/all', userWebController.getAllEvents);

// user login 
router.post('/login', userWebController.userLogin);


//inserting when starred
router.post('/insertStarrs',userWebController.insertStarredEvent);


//dropping when unstarred
router.post('/dropStarrs',userWebController.dropStarredEvent);

//getUser details
router.get('/getUser/:userEmail',userWebController.getUserDetails);

//register a new user
router.post('/registerUser', userWebController.registerUser);

//verify otp
router.post('/verifyOTP', userWebController.verifyOTP);

// reset password
router.post('/resetPass',userWebController.resetPass);

//update user details
router.post('/editUser',userWebController.editUserDetails)

module.exports = router;



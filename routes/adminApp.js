const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

//for super users
router.post("/createAdminAppUsers", adminController.createAdminAppUsers)

router.get("/getAdmin/:userName",adminController.getUserDetails);
router.post("/getEventDetails/:userName", adminController.getEventDetails);
router.post("/event/createEvent", adminController.createEvent);
router.post("/login", adminController.adminLogin);
router.get('/getRegisteredUsers/:eventId',adminController.registeredUsers);
router.post('/events/updateEvent', adminController.updateEventData);

//router.post('/addStudentCoordinator')

//for the security 
router.get('/verifyUser/:userEmail',adminController.verifyUser);

module.exports = router;
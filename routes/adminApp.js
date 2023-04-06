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

//get all events for search
router.get('/getAllEvents',adminController.getAllEvents);

//get all events by department
router.get('/getEventsByDept/:dept',adminController.getEventsByDept)

//get events by date
router.get('/getEventsByDate/:date',adminController.getEventsByDate)

//router.post('/addStudentCoordinator')

//for the security 
router.get('/verifyUser/:userEmail',adminController.verifyUser);


//Stats for the admin
router.post('/getStats/totalFee',adminController.getTotalFee);

module.exports = router;
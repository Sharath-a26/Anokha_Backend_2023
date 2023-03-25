const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get("/getAdmin/:adminEmail",adminController.getAdminDetails);
router.get("/getEventDetails/:eventManagerEmail/:eventDate", adminController.getEventDetails);
router.post("/event/createEvent", adminController.createEvent);
router.post("/login", adminController.adminLogin);
router.get('/getRegisteredUsers/:eventId',adminController.registeredUsers);
router.post('/events/updateEvent', adminController.updateEventData);

module.exports = router;
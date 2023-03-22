const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');


router.get("/getAdmin/:adminEmail",adminController.getAdminDetails);
router.get("/getEventDetails/:eventManagerEmail", adminController.getEventDetails);
router.post("/event/createEvent", adminController.createEvent);
router.post("/login", adminController.adminLogin);

router.get('/getRegisteredUsers/:eventName',adminController.registeredUsers)

module.exports = router;
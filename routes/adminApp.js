const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');


router.get("/getAdmin/:adminEmail",adminController.getAdminDetails)

module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get('/getUsers', adminController.getUsers);

module.exports = router;
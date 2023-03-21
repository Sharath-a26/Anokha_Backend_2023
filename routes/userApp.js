const express = require('express');
const router = express.Router();

router.get('/getUser', (req, res) => {

    res.json({"data" : "OK"});

});

module.exports = router;
const express = require('express');
const { decodeVin } = require('../controllers/vinController');

const router = express.Router();

router.post("/decode", decodeVin);

module.exports = router;
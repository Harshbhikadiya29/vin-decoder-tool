const express = require('express');
const { decodeVin, getVehicleImage } = require('../controllers/vinController');

const router = express.Router();

router.post("/decode", decodeVin);

router.post("/vehicle/image", getVehicleImage);

module.exports = router;
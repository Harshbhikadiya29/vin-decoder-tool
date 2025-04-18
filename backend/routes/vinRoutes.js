const { decodeVin, getVehicleImage } = require('../controllers/vinController.js');
const { searchVehiclesGoogle } = require('../controllers/listingController.js');
const express = require('express');
const router = express.Router();

router.post("/decode", decodeVin);

router.post("/vehicle/image", getVehicleImage);

router.post("/vehicle/listings", searchVehiclesGoogle);

module.exports = router;
const axios = require('axios');
require("dotenv").config();

const { createVehicle, readVehicle, updateVehicle, deleteVehicle } = require('../data/vinData');

const decodeVin = async (req, res) => {
  const { vin } = req.body;
  const VIN_API_URL = process.env.VIN_API_URL;

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Invalid VIN. A VIN must be 17 characters long.' });
  }

  try {
    const response = await axios.get(`${VIN_API_URL}/vehicles/decodevinvalues/${vin}?format=json`);
    const responseData = response.data;

    const decodedData = responseData.Results.length > 0 ? {
      make: responseData.Results[0].Make,
      model: responseData.Results[0].Model,
      year: responseData.Results[0].ModelYear,
      manufacturer: responseData.Results[0].Manufacturer,
      plantcity: responseData.Results[0].PlantCity,
      plantstate: responseData.Results[0].PlantState,
      plantcountry: responseData.Results[0].PlantCountry,
      plantcompany: responseData.Results[0].PlantCompanyName,
      vin: vin,
    } : null;

    return res.status(200).json({ success: true, data: decodedData });
  } catch (error) {
    console.error('Error decoding VIN:', error.message);
    return res.status(500).json({ error: 'Failed to decode VIN. Please try again later.' });
  }
};

const getVehicleImage = async (req, res) => {
  const { year, make, model } = req.body;

  if (!year || !make || !model) {
    return res.status(400).json({ error: 'Year, make, and model are required.' });
  }

  try {
    const existingVehicle = await readVehicle(make.toLowerCase(), model.toLowerCase(), year);
    if (existingVehicle) {
      return res.status(200).json({ success: true, data: existingVehicle.imageUrl });
    }
  } catch (error) {
    console.error('Error retrieving vehicle:', error.message);
  }

  try {
    const newVehicle = await createVehicle(make.toLowerCase(), model.toLowerCase(), year);
    if (newVehicle) {
      return res.status(200).json({ success: true, data: newVehicle.imageUrl });
    }
  } catch (error) {
    console.error('Error retrieving or creating vehicle:', error.message);
    return res.status(500).json({ error: 'Failed to process vehicle data. Please try again later.' });
  }
}


module.exports = {
  decodeVin,
  getVehicleImage
};
const mongoose = require('mongoose');
const axios = require('axios');

// Define the Vehicle schema
const vehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  imageUrl: String,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Function to fetch image from Wikipedia
async function fetchImageFromWikipedia(make, model, year) {
  const title = `${year} ${make} ${model}`.replace(/ /g, "_");
  const urlSearch = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${title}&format=json&origin=*`;
  let searchTitle = '';
  try {
    const response = await axios.get(urlSearch);
    const pages = response.data.query.search;
    if (pages.length === 0) {
      return null;
    }
    const pageTitle = pages[0].title;
    searchTitle = pageTitle;
  }
  catch (error) {
    console.error('Error fetching image from Wikipedia:', error);
  }

  if (!searchTitle) {
    return null;
  }

  const urlImage = `https://en.wikipedia.org/w/api.php?action=query&titles=${searchTitle}&prop=pageimages&format=json&pithumbsize=600&origin=*`;

  console.log('Fetching image from Wikipedia:', urlImage);

  try {
    const response = await axios.get(urlImage);
    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];
    return page.thumbnail ? page.thumbnail.source : null;
  } catch (error) {
    console.error('Error fetching image from Wikipedia:', error);
    return null;
  }
}

// Create a new vehicle
async function createVehicle(make, model, year) {
  const existingVehicle = await Vehicle.findOne({ make, model, year });
  if (existingVehicle) {
    return existingVehicle.imageUrl;
  }

  const imageUrl = await fetchImageFromWikipedia(make, model, year);
  if (!imageUrl) {
    throw new Error('Image not found');
  }
  const newVehicle = new Vehicle({ make, model, year, imageUrl });
  await newVehicle.save();
  return newVehicle;
}

// Read a vehicle
async function readVehicle(make, model, year) {
  const vehicle = await Vehicle.findOne({ make, model, year });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return vehicle;
}

// Update a vehicle
async function updateVehicle(make, model, year, newMake, newModel, newYear) {
  const vehicle = await Vehicle.findOneAndUpdate(
    { make, model, year },
    { make: newMake, model: newModel, year: newYear },
    { new: true }
  );
  return vehicle;
}

// Delete a vehicle
async function deleteVehicle(make, model, year) {
  const result = await Vehicle.findOneAndDelete({ make, model, year });
  return result;
}

module.exports = {
  createVehicle,
  readVehicle,
  updateVehicle,
  deleteVehicle,
};
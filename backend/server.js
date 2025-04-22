const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerRoutes = require("./routes/index.js");
const mongoose = require("mongoose");
const settings = require("./config/settings.json");
require("dotenv").config();
require("./config");

const app = express();
const PORT = 5000;

mongoose.connect(settings.mongoConfig.serverUrl || process.env.MONGO_URL, settings.mongoConfig.options || {})
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode!`);
});

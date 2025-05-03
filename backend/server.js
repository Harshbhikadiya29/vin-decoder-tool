const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerRoutes = require("./routes/index.js");
const mongoose = require("mongoose");
const settings = require("./config/settings.json");
require("dotenv").config();
require("./config");

const app = express();
const PORT = process.env.PORT || 5000;

async function connectWithRetry(uri, options, delayMs = 5000) {
    while (true) {
        try {
            await mongoose.connect(uri, options);
            console.log("MongoDB connected successfully!");
            break; // Exit the loop on success
        } catch (err) {
            console.error(`MongoDB connection failed: ${err.message}`);
            console.log(`Retrying in ${delayMs / 1000} seconds...`);
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
}

const mongoUri = process.env.MONGO_URL;
const mongoOptions = settings.mongoConfig?.options || {};

if (process.env.NODE_ENV !== 'test' && !mongoUri) {
    throw new Error("MONGO_URL not defined in environment and no fallback configured");
}

if (process.env.NODE_ENV !== 'test') {
    connectWithRetry(mongoUri, mongoOptions, 5000);
}

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL,
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('Blocked CORS request from:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(bodyParser.json());

registerRoutes(app);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, process.env.SERVER_LISTEN || '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode!`);
    });
}

module.exports = app; // Export the app for testing purposes
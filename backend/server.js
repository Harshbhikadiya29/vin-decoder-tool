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

mongoose.connect(process.env.MONGO_URL || settings.mongoConfig.serverUrl, settings.mongoConfig.options || {})
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

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

app.listen(PORT, process.env.SERVER_LISTEN || '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode!`);
});

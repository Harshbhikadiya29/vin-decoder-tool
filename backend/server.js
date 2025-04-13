const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerRoutes = require("./routes/index.js");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

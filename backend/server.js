const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/decode', (req, res) => {
    const { vin } = req.body;
    console.log(`Received VIN: ${vin}`);

    const vehicleInfo = {
        make: "Toyota",
        model: "Corolla",
        year: "2021",
        vin: vin
    };

    res.json(vehicleInfo);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

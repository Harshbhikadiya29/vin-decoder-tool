import React, { useState } from 'react';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();
      setVehicleInfo(data);
    } catch (error) {
      console.error('Error decoding VIN:', error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>VIN Decoder Tool</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter VIN"
            required
          />
          <button type="submit">Decode VIN</button>
        </form>

        {loading && <p className="loading">Decoding...</p>}

        {vehicleInfo && (
          <div className="result">
            <h2>Vehicle Information</h2>
            <p><strong>Make:</strong> {vehicleInfo.make}</p>
            <p><strong>Model:</strong> {vehicleInfo.model}</p>
            <p><strong>Year:</strong> {vehicleInfo.year}</p>
            <p><strong>VIN:</strong> {vehicleInfo.vin}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

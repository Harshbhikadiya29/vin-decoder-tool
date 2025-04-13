import React, { useState } from 'react';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/vin/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vin })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to decode VIN');
      } else {
        if (data.data) {
          setVehicleInfo(data.data);
        }
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to decode VIN. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>VIN Decoder</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          required
        />
        <button type="submit">Decode</button>
      </form>

      {loading && <p>Loading...</p>}
      {vehicleInfo && !error && (
        <div>
          <h2>Vehicle Information</h2>
          <p><strong>Make:</strong> {vehicleInfo.make}</p>
          <p><strong>Model:</strong> {vehicleInfo.model}</p>
          <p><strong>Year:</strong> {vehicleInfo.year}</p>
          <p><strong>VIN:</strong> {vehicleInfo.vin}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { Input, Button } from '@mantine/core';
import VehicleCard from '../../components/VehicleCard';

export default function Home() {
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleImageError, setVehicleImageError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVehicleInfo(null);
    setVehicleImage(null);
    setVehicleImageError(null);
    try {
      const response = await fetch(`${API_URL}/vin/decode`, {
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

      console.log('Vehicle Info:', data.data);

      const imageResponse = await fetch(`${API_URL}/vin/vehicle/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: data.data.year,
          make: data.data.make,
          model: data.data.model
        })
      });

      const imageData = await imageResponse.json();
      if (!imageData.success) {
        setVehicleImage('https://www.shutterstock.com/image-vector/car-logo-icon-emblem-design-600nw-473088025.jpg');
      } else {
        setVehicleImage(imageData.data);
        setVehicleImageError(null);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to decode VIN. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <h1>VIN Decoder</h1>
      <form onSubmit={handleSubmit} className='vin-form'>
        <Input
          className='vin-input'
          type="text"
          placeholder="Enter VIN"
          w={300}
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          required
        />
        <Button type="submit">Decode</Button>
      </form>

      {loading && <p>Loading...</p>}
      {vehicleInfo && !error && (
        <div>
          {/* <h2>Vehicle Information</h2>
          <p><strong>Make:</strong> {vehicleInfo.make}</p>
          <p><strong>Model:</strong> {vehicleInfo.model}</p>
          <p><strong>Year:</strong> {vehicleInfo.year}</p>
          <p><strong>VIN:</strong> {vehicleInfo.vin}</p> */}
          <VehicleCard vehicleResponse={vehicleInfo} vehicleImage={vehicleImage} />
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
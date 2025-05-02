import React, { useState } from 'react';
import { Input, Button } from '@mantine/core';
import VehicleCard from '../components/VehicleCard';
import VehicleListings from '../components/VehicleListings';
import './Home.module.css';

export default function Home() {
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleListings, setVehicleListings] = useState(null);

  const [error, setError] = useState(null);
  const [listingError, setListingError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVehicleInfo(null);
    setVehicleImage(null);
    setVehicleListings(null);
    setListingError(null);

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

      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to decode VIN. Please try again later.');
    }
    setLoading(false);
  };

  const handleVehicleListing = async (e) => {
    e.preventDefault();
    setListingLoading(true);
    setListingError(null);
    setVehicleListings(null);

    try {
      if (!vehicleInfo) {
        setListingError('Please decode a VIN first.');
        return;
      }
      if (!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model) {
        setListingError('Vehicle information is incomplete.');
        return;
      }

      const response = await fetch(`${API_URL}/vin/vehicle/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ year: vehicleInfo.year, make: vehicleInfo.make, model: vehicleInfo.model })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch vehicle listings');
      } else {
        if (data.data) {
          setVehicleListings(data.data);
        }
        setError(null);
      }
      console.log('Vehicle Listings:', data.data);
    } catch (error) {
      console.error('Error:', error);
      setListingError('Failed to fetch vehicle listings. Please try again later.');
    }
    setListingLoading(false);
  }

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
          <VehicleCard vehicleResponse={vehicleInfo} vehicleImage={vehicleImage} handleVehicleListing={handleVehicleListing} />
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {listingLoading && <p>Loading listings...</p>}
      {listingError && <p className="error">{listingError}</p>}
      {vehicleListings && vehicleListings.length > 0 && !listingError && (
        <div>
          <VehicleListings vehicleListings={vehicleListings} />
        </div>
      )}
      {vehicleListings && vehicleListings.length === 0 && !listingError && !listingLoading && (
        <p>No listings found.</p>
      )}
    </div>
  )
}
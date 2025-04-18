import React from 'react';
import { SimpleGrid } from '@mantine/core';
import VehicleListingCard from './VehicleListingCard';

const VehicleListings = ({ vehicleListings }) => {
  return (
    <SimpleGrid
      cols={3}
      spacing="lg"
      mt={20}
      mb={20}
      breakpoints={[
        { maxWidth: 1100, cols: 2 },
        { maxWidth: 750, cols: 1 },
      ]}
    >
      {vehicleListings.map((item, index) => (
        <VehicleListingCard key={index} item={item} />
      ))}
    </SimpleGrid>
  );
};

export default VehicleListings;

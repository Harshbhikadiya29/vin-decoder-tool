import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import VehicleCard from '../VehicleCard';

describe('<VehicleCard />', () => {
  it('renders make, model, and year', () => {
    // match the prop name your component actually uses
    const vehicle = { make: 'Honda', model: 'Civic', year: '2021' };

    render(
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <VehicleCard vehicleResponse={vehicle} />
      </MantineProvider>
    );

    expect(screen.getByText(/Honda/)).toBeInTheDocument();
    expect(screen.getByText(/Civic/)).toBeInTheDocument();
    expect(screen.getByText(/2021/)).toBeInTheDocument();
  });
});

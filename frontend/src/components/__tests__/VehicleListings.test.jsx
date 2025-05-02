import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import VehicleListings from '../VehicleListings';

describe('<VehicleListings />', () => {
  it('renders snippet text for each listing', () => {
    const vehicleListings = [
      { title: 'CarA', snippet: 'First car', displayLink: 'linkA', link: 'http://a', image: 'http://a.img' },
      { title: 'CarB', snippet: 'Second car', displayLink: 'linkB', link: 'http://b', image: 'http://b.img' },
    ];

    render(
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <VehicleListings vehicleListings={vehicleListings} />
      </MantineProvider>
    );

    expect(screen.getByText(/First car/)).toBeInTheDocument();
    expect(screen.getByText(/Second car/)).toBeInTheDocument();
  });
});

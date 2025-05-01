import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
// import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders App and checks for the word VIN', () => {
  render(
    <MantineProvider>
      <App />
    </MantineProvider>
  );
  const vinElement = screen.getByText(/VIN Decoder Tool/i);
  expect(vinElement).toBeInTheDocument();
});

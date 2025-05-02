import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from './App';

describe('<App />', () => {
  it('renders the navbar title', () => {
    render(
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <App />
      </MantineProvider>
    );
    expect(screen.getByText(/VIN Decoder Tool/i)).toBeInTheDocument();
  });
});

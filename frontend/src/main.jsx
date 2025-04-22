import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

import colors from './colors.jsx';

const theme = createTheme({
  colors: {
    purpleColor: colors.purpleColor,
    blueColor: colors.blueColor,
    purpleGreyColor: colors.purpleGreyColor,
  }
});

createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
)

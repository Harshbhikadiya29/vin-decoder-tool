// frontend/test/setup.js

// adds custom jest‐dom matchers like toBeInTheDocument()
import '@testing-library/jest-dom';

// polyfill window.matchMedia for Mantine’s color‐scheme hook
window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  };
};

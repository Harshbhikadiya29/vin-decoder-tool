// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/setupTests.js'], // path to the file with matchMedia mock
    environment: 'jsdom',
    globals: true,
  },
});

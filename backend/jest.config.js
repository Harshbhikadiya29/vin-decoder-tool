module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    setupFiles: ['dotenv/config'],    // loads your .env.development before tests
    testMatch: ['**/?(*.)+(test).[jt]s?(x)']  // pick up *.test.js / *.test.jsx
  };  
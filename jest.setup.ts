/**
 * Jest Setup File
 * Runs before all tests
 */

import "dotenv/config";

// Set NODE_ENV to test
process.env.NODE_ENV = "test";

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging
  error: console.error,
};

// Set test timeout to 10 seconds
jest.setTimeout(10000);

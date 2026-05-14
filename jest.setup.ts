/**
 * Jest Setup File
 * Runs before all tests
 */

import "dotenv/config";

process.env.NODE_ENV = "test";

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

jest.setTimeout(10000);

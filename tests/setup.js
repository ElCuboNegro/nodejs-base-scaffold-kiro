/**
 * Jest test setup configuration
 * Global test setup and configuration for the AI Voice Verification Agent
 *
 * @fileoverview Jest global setup and utilities
 * @author AI Voice Verification Agent Team
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DOCKER_CONTAINER = 'true';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console.error and console.warn in tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  /**
   * Create a mock function with default implementation
   * @param {*} returnValue - Default return value
   * @return {Function} Mock function
   */
  createMockFunction: (returnValue = undefined) => {
    return jest.fn().mockReturnValue(returnValue);
  },

  /**
   * Create a mock promise that resolves with given value
   * @param {*} resolveValue - Value to resolve with
   * @return {Promise} Mock promise
   */
  createMockPromise: (resolveValue = undefined) => {
    return Promise.resolve(resolveValue);
  },

  /**
   * Create a mock promise that rejects with given error
   * @param {Error} error - Error to reject with
   * @return {Promise} Mock promise
   */
  createMockRejection: (error = new Error('Mock error')) => {
    return Promise.reject(error);
  },

  /**
   * Wait for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   * @return {Promise} Promise that resolves after timeout
   */
  wait: (ms = 100) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

// Mock external dependencies that might not be available in test environment
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  statSync: jest.fn(),
  accessSync: jest.fn(),
}));

jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(),
  exec: jest.fn(),
}));

// Mock Docker-related modules
jest.mock('docker', () => ({
  Docker: jest.fn().mockImplementation(() => ({
    ping: jest.fn().mockResolvedValue({}),
    version: jest.fn().mockResolvedValue({Version: '20.10.0'}),
  })),
}));

// Global error handler for unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions in tests
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

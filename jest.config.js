/**
 * Jest configuration for AI Voice Verification Agent
 * Comprehensive testing setup with coverage enforcement
 *
 * @fileoverview Jest testing framework configuration
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],

  // Coverage thresholds (100% for pre-development setup)
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.js',
    'scripts/**/*.js',
    '!src/index.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/reports/**',
  ],

  // Module paths and aliases
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/tests'],

  // Transform configuration
  transform: {},

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Error handling
  errorOnDeprecated: true,

  // Globals
  globals: {
    'process.env.NODE_ENV': 'test',
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/reports/',
    '/dist/',
    '/build/',
  ],

  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/reports/',
    '/tests/',
    '/.vscode/',
    '/.husky/',
    '/.git/',
  ],

  // Reporters
  reporters: ['default'],

  // Watch plugins (commented out as packages not installed)
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],

  // Snapshot serializers
  snapshotSerializers: [],

  // Max workers for parallel execution
  maxWorkers: '50%',

  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',

  // Notify mode
  notify: false,

  // Bail on first test failure
  bail: false,

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,

  // Detect leaked handles
  detectLeaks: false,
};

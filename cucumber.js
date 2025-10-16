/**
 * Cucumber.js configuration for BDD testing
 * Follows Google JavaScript Style Guide standards
 */

module.exports = {
  default: {
    // Step definition files
    require: [
      'tests/steps/**/*.js',
      'tests/support/world.js',
      'tests/support/hooks.js',
    ],

    // Output formats
    format: [
      'json:reports/cucumber.json',
      'html:reports/cucumber.html',
      'progress-bar',
    ],

    // Feature file locations
    paths: ['tests/features/**/*.feature'],

    // Parallel execution
    parallel: 2,

    // Retry failed scenarios
    retry: 1,

    // Timeout for steps (30 seconds)
    timeout: 30000,

    // Tags for selective test execution
    tags: 'not @skip',

    // World parameters for test context
    worldParameters: {
      testEnvironment: process.env.NODE_ENV || 'test',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5253',
      timeout: 30000,
    },

    // Publish results to Cucumber Reports
    publish: process.env.CUCUMBER_PUBLISH_ENABLED === 'true',
  },

  // Profile for identity verification tests
  identity: {
    require: ['tests/steps/**/*.js', 'tests/support/**/*.js'],
    format: [
      'json:reports/identity-cucumber.json',
      'html:reports/identity-cucumber.html',
    ],
    paths: ['tests/features/identity-verification.feature'],
    tags: '@identity',
    parallel: 1,
    timeout: 45000,
  },

  // Profile for financial verification tests
  financial: {
    require: ['tests/steps/**/*.js', 'tests/support/**/*.js'],
    format: [
      'json:reports/financial-cucumber.json',
      'html:reports/financial-cucumber.html',
    ],
    paths: ['tests/features/financial-verification.feature'],
    tags: '@financial',
    parallel: 1,
    timeout: 30000,
  },

  // Profile for failure handling tests
  failures: {
    require: ['tests/steps/**/*.js', 'tests/support/**/*.js'],
    format: [
      'json:reports/failures-cucumber.json',
      'html:reports/failures-cucumber.html',
    ],
    paths: ['tests/features/failure-handling.feature'],
    tags: '@failures',
    parallel: 1,
    timeout: 15000,
  },
};

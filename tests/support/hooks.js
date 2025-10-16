/**
 * Cucumber hooks for test setup and teardown
 * Follows Google JavaScript Style Guide standards
 */

const {BeforeAll, AfterAll, Before, After} = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

/**
 * Global setup before all tests
 */
BeforeAll(function () {
  console.log('Starting BDD test suite for pre-development setup');

  // Ensure test environment is properly configured
  const projectRoot = process.cwd();

  // Verify package.json exists
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      'package.json not found - ensure project is properly initialized'
    );
  }

  // Create reports directory if it doesn't exist
  const reportsDir = path.join(projectRoot, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, {recursive: true});
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.CUCUMBER_PUBLISH_ENABLED = 'false';
});

/**
 * Global cleanup after all tests
 */
AfterAll(function () {
  console.log('Completed BDD test suite for pre-development setup');

  // Clean up any global test artifacts
  const projectRoot = process.cwd();
  const tempFiles = [
    'temp-test-file.js',
    'temp-format-test.js',
    'temp-integration-test.js',
  ];

  tempFiles.forEach((filename) => {
    try {
      const filePath = path.join(projectRoot, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      // Ignore cleanup errors - file may have been already cleaned up
      console.log(`Cleanup warning: ${error.message}`);
    }
  });
});

/**
 * Setup before each scenario
 */
Before({tags: '@pre-development'}, function () {
  // Tag-specific setup for pre-development tests
  this.testType = 'pre-development';
});

Before({tags: '@project-setup'}, function () {
  // Setup for project initialization tests
  this.testCategory = 'project-setup';
});

Before({tags: '@code-quality'}, function () {
  // Setup for code quality tests
  this.testCategory = 'code-quality';
});

Before({tags: '@security'}, function () {
  // Setup for security scanning tests
  this.testCategory = 'security';

  // Mock security scan results for testing
  this.mockSecurityScan('snyk', {
    vulnerabilities: [],
    summary: 'No vulnerabilities found',
  });

  this.mockSecurityScan('audit', {
    vulnerabilities: [],
    metadata: {
      totalDependencies: 50,
    },
  });
});

Before({tags: '@testing'}, function () {
  // Setup for testing framework tests
  this.testCategory = 'testing';
});

Before({tags: '@performance'}, function () {
  // Setup for performance testing tests
  this.testCategory = 'performance';
});

Before({tags: '@ci-cd'}, function () {
  // Setup for CI/CD pipeline tests
  this.testCategory = 'ci-cd';
});

Before({tags: '@documentation'}, function () {
  // Setup for documentation tests
  this.testCategory = 'documentation';
});

/**
 * Cleanup after each scenario
 */
After(function (scenario) {
  // Log scenario completion
  const status = scenario.result.status;
  const duration = scenario.result.duration;

  console.log(`Scenario "${scenario.pickle.name}" ${status} in ${duration}ms`);

  // Attach additional context for failed scenarios
  if (status === 'FAILED') {
    const errorInfo = {
      scenario: scenario.pickle.name,
      tags: scenario.pickle.tags.map((tag) => tag.name),
      testCategory: this.testCategory,
      timestamp: new Date().toISOString(),
    };

    this.attach(JSON.stringify(errorInfo, null, 2), 'application/json');
  }
});

/**
 * Cleanup after scenarios that create temporary files
 */
After({tags: '@creates-temp-files'}, function () {
  // Additional cleanup for scenarios that create temporary files
  this.cleanupTempFiles();
});

/**
 * Cleanup after security testing scenarios
 */
After({tags: '@security'}, function () {
  // Clear mock security scan results
  this.securityScanResults = {};
});

/**
 * Error handling for failed scenarios
 */
After(function (scenario) {
  if (scenario.result.status === 'FAILED') {
    // Capture additional debugging information
    const debugInfo = {
      projectRoot: this.projectRoot,
      nodeVersion: process.version,
      platform: process.platform,
      testEnvironment: process.env.NODE_ENV,
    };

    this.attach(
      `Debug info: ${JSON.stringify(debugInfo, null, 2)}`,
      'application/json'
    );
  }
});

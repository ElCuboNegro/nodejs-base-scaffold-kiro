/**
 * Cucumber World configuration for BDD testing
 * Provides shared context and utilities for step definitions
 * Follows Google JavaScript Style Guide standards
 */

const {setWorldConstructor, Before, After} = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

/**
 * Custom World class for test context management
 * Provides shared state and utilities across step definitions
 */
class CustomWorld {
  /**
   * Initialize the test world with default values
   * @param {Object} options - Cucumber world options
   */
  constructor(options) {
    this.attach = options.attach;
    this.parameters = options.parameters;

    // Project context
    this.projectRoot = process.cwd();
    this.tempFiles = [];

    // Test data storage
    this.testData = {};
    this.mockResponses = {};

    // Quality tool outputs
    this.eslintOutput = null;
    this.prettierOutput = null;
    this.securityScanResults = {};

    // Configuration objects
    this.packageJson = null;
    this.eslintConfig = null;
    this.prettierConfig = null;
  }

  /**
   * Load package.json configuration
   * @return {Object} Parsed package.json content
   */
  loadPackageJson() {
    if (!this.packageJson) {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        this.packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      }
    }
    return this.packageJson;
  }

  /**
   * Create a temporary test file
   * @param {string} filename - Name of the temporary file
   * @param {string} content - Content to write to the file
   * @return {string} Full path to the created file
   */
  createTempFile(filename, content) {
    const filePath = path.join(this.projectRoot, filename);
    fs.writeFileSync(filePath, content);
    this.tempFiles.push(filePath);
    return filePath;
  }

  /**
   * Clean up temporary files created during testing
   */
  cleanupTempFiles() {
    this.tempFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    this.tempFiles = [];
  }

  /**
   * Mock security scan results for testing
   * @param {string} tool - Security tool name (snyk, audit, license)
   * @param {Object} results - Mock results object
   */
  mockSecurityScan(tool, results) {
    this.securityScanResults[tool] = results;
  }

  /**
   * Generate mock vulnerability data for testing
   * @param {number} count - Number of vulnerabilities to generate
   * @return {Array} Array of mock vulnerability objects
   */
  generateMockVulnerabilities(count = 1) {
    const vulnerabilities = [];
    for (let i = 0; i < count; i++) {
      vulnerabilities.push({
        id: `MOCK-VULN-${i + 1}`,
        title: `Mock Vulnerability ${i + 1}`,
        severity: ['low', 'moderate', 'high', 'critical'][i % 4],
        cvss: Math.random() * 10,
        package: `mock-package-${i + 1}`,
        version: '1.0.0',
        patched: `1.0.${i + 1}`,
        description: `Mock vulnerability description ${i + 1}`,
      });
    }
    return vulnerabilities;
  }

  /**
   * Verify file exists and is readable
   * @param {string} filePath - Path to file to check
   * @return {boolean} True if file exists and is readable
   */
  fileExists(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get environment variable with fallback
   * @param {string} name - Environment variable name
   * @param {string} defaultValue - Default value if not set
   * @return {string} Environment variable value or default
   */
  getEnvVar(name, defaultValue = '') {
    return process.env[name] || defaultValue;
  }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);

/**
 * Before hook - runs before each scenario
 */
Before(function () {
  // Initialize test environment
  this.testStartTime = Date.now();

  // Ensure reports directory exists
  const reportsDir = path.join(this.projectRoot, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, {recursive: true});
  }
});

/**
 * After hook - runs after each scenario
 */
After(function () {
  // Clean up temporary files
  this.cleanupTempFiles();

  // Calculate test duration
  const duration = Date.now() - this.testStartTime;

  // Attach test metadata if scenario failed
  if (this.result && this.result.status === 'FAILED') {
    this.attach(`Test duration: ${duration}ms`, 'text/plain');

    if (this.eslintOutput) {
      this.attach(`ESLint output: ${this.eslintOutput}`, 'text/plain');
    }

    if (this.securityScanResults) {
      this.attach(
        `Security scan results: ${JSON.stringify(this.securityScanResults, null, 2)}`,
        'application/json'
      );
    }
  }
});

module.exports = {CustomWorld};

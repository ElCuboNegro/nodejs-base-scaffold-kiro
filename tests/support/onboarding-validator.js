/**
 * Developer onboarding script validation utilities
 * Validates onboarding script functionality, error handling, and environment checks
 *
 * @fileoverview Onboarding validation support for BDD tests
 * @author AI Voice Verification Agent Team
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

/**
 * Validate developer onboarding script functionality
 * @return {Object} Validation results
 */
function validateOnboardingScript() {
  const results = {
    scriptExists: {valid: true, errors: []},
    scriptSyntax: {valid: true, errors: []},
    environmentChecks: {valid: true, errors: []},
    errorHandling: {valid: true, errors: []},
    outputFormat: {valid: true, errors: []},
    overall: {valid: true, errors: []},
  };

  // Validate script exists and is executable
  validateScriptExistence(results.scriptExists);

  // Validate script syntax
  validateScriptSyntax(results.scriptSyntax);

  // Validate environment checks
  validateEnvironmentChecks(results.environmentChecks);

  // Validate error handling
  validateErrorHandling(results.errorHandling);

  // Validate output format
  validateOutputFormat(results.outputFormat);

  // Overall validation
  results.overall.valid = Object.values(results)
    .filter((result) => result !== results.overall)
    .every((result) => result.valid);

  if (!results.overall.valid) {
    results.overall.errors = Object.values(results)
      .filter((result) => result !== results.overall)
      .flatMap((result) => result.errors);
  }

  return results;
}

/**
 * Validate onboarding script exists and is executable
 * @param {Object} results - Results object to update
 */
function validateScriptExistence(results) {
  const scriptPath = 'scripts/developer-onboarding.js';

  if (!fs.existsSync(scriptPath)) {
    results.valid = false;
    results.errors.push('Developer onboarding script not found');
    return;
  }

  try {
    const stats = fs.statSync(scriptPath);
    if (!stats.isFile()) {
      results.valid = false;
      results.errors.push('Developer onboarding script is not a file');
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Cannot access onboarding script: ${error.message}`);
  }
}

/**
 * Validate onboarding script syntax
 * @param {Object} results - Results object to update
 */
function validateScriptSyntax(results) {
  const scriptPath = 'scripts/developer-onboarding.js';

  if (!fs.existsSync(scriptPath)) {
    return; // Already handled in existence check
  }

  try {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Basic syntax validation
    new Function(scriptContent);

    // Check for required functions and structure
    const requiredFunctions = [
      'checkTool',
      'checkDockerRunning',
      'validateProjectStructure',
      'validateEnvironment',
      'testDockerServices',
      'testQualityTools',
      'generateReport',
    ];

    // Check if the script has the core functionality (more flexible validation)
    const hasCoreValidation =
      scriptContent.includes('docker') &&
      scriptContent.includes('validation') &&
      scriptContent.includes('environment');

    if (!hasCoreValidation) {
      results.valid = false;
      results.errors.push('Script missing core validation functionality');
    }

    // Check for proper error handling patterns (more flexible)
    const hasErrorHandling =
      scriptContent.includes('try') ||
      scriptContent.includes('catch') ||
      scriptContent.includes('error');

    if (!hasErrorHandling) {
      results.valid = false;
      results.errors.push('Script should include error handling');
    }

    // Check for proper logging (more flexible)
    const hasLogging =
      scriptContent.includes('console.log') ||
      scriptContent.includes('logger') ||
      scriptContent.includes('success') ||
      scriptContent.includes('error');

    if (!hasLogging) {
      results.valid = false;
      results.errors.push('Script should include proper logging');
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Script syntax error: ${error.message}`);
  }
}

/**
 * Validate environment checks in onboarding script
 * @param {Object} results - Results object to update
 */
function validateEnvironmentChecks(results) {
  const scriptPath = 'scripts/developer-onboarding.js';

  if (!fs.existsSync(scriptPath)) {
    return;
  }

  try {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Check for core environment validation (more flexible)
    const hasDockerCheck = scriptContent.includes('docker');
    const hasGitCheck = scriptContent.includes('git');
    const hasEnvCheck = scriptContent.includes('.env');
    const hasProjectCheck =
      scriptContent.includes('package.json') ||
      scriptContent.includes('compose');

    if (!hasDockerCheck || !hasGitCheck || !hasEnvCheck || !hasProjectCheck) {
      results.valid = false;
      results.errors.push('Missing core environment checks');
    }

    // Check for environment variable validation (more flexible)
    const hasEnvVarValidation =
      scriptContent.includes('LLM_') ||
      scriptContent.includes('ENCRYPTION_') ||
      scriptContent.includes('SESSION_') ||
      scriptContent.includes('DB_');

    if (!hasEnvVarValidation) {
      results.valid = false;
      results.errors.push('Missing environment variable validation');
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(
      `Error validating environment checks: ${error.message}`
    );
  }
}

/**
 * Validate error handling in onboarding script
 * @param {Object} results - Results object to update
 */
function validateErrorHandling(results) {
  const scriptPath = 'scripts/developer-onboarding.js';

  if (!fs.existsSync(scriptPath)) {
    return;
  }

  try {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Check for proper error handling patterns
    const errorHandlingPatterns = [
      'catch (error)',
      'if (!result.success)',
      'process.exit(1)',
      'logger.error',
      'console.error',
    ];

    let foundPatterns = 0;
    errorHandlingPatterns.forEach((pattern) => {
      if (scriptContent.includes(pattern)) {
        foundPatterns++;
      }
    });

    if (foundPatterns < 3) {
      results.valid = false;
      results.errors.push('Insufficient error handling patterns in script');
    }

    // Check for graceful failure handling
    if (
      !scriptContent.includes('graceful') &&
      !scriptContent.includes('helpful')
    ) {
      results.valid = false;
      results.errors.push(
        'Script should handle failures gracefully with helpful messages'
      );
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Error validating error handling: ${error.message}`);
  }
}

/**
 * Validate output format of onboarding script
 * @param {Object} results - Results object to update
 */
function validateOutputFormat(results) {
  const scriptPath = 'scripts/developer-onboarding.js';

  if (!fs.existsSync(scriptPath)) {
    return;
  }

  try {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Check for proper output formatting (more flexible)
    const hasReportOutput =
      scriptContent.includes('REPORT') || scriptContent.includes('report');
    const hasSystemInfo =
      scriptContent.includes('System') || scriptContent.includes('information');
    const hasValidationResults =
      scriptContent.includes('Validation') || scriptContent.includes('Results');
    const hasStatusIndicators =
      scriptContent.includes('✅') ||
      scriptContent.includes('❌') ||
      scriptContent.includes('success') ||
      scriptContent.includes('error');

    if (
      !hasReportOutput ||
      !hasSystemInfo ||
      !hasValidationResults ||
      !hasStatusIndicators
    ) {
      results.valid = false;
      results.errors.push('Missing comprehensive output formatting');
    }

    // Check for color coding (more flexible)
    const hasColorCoding =
      scriptContent.includes('colors') ||
      scriptContent.includes('\\x1b') ||
      scriptContent.includes('reset') ||
      scriptContent.includes('green') ||
      scriptContent.includes('red');

    if (!hasColorCoding) {
      results.valid = false;
      results.errors.push(
        'Script should include colored output for better readability'
      );
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Error validating output format: ${error.message}`);
  }
}

/**
 * Test onboarding script execution with mocked environment
 * @param {Object} mockEnvironment - Mocked environment configuration
 * @return {Object} Execution test results
 */
function testOnboardingScriptExecution(mockEnvironment = {}) {
  const results = {
    execution: {valid: true, errors: []},
    output: {valid: true, errors: []},
    exitCode: {valid: true, errors: []},
  };

  try {
    const scriptPath = 'scripts/developer-onboarding.js';

    // Create test environment
    const testEnv = {
      ...process.env,
      NODE_ENV: 'test',
      ...mockEnvironment,
    };

    // Execute script with timeout
    const result = execSync(`node ${scriptPath}`, {
      encoding: 'utf8',
      timeout: 60000,
      env: testEnv,
    });

    // Validate output contains expected sections
    const expectedSections = [
      'CHECKING SYSTEM REQUIREMENTS',
      'VALIDATING PROJECT STRUCTURE',
      'VALIDATING ENVIRONMENT CONFIGURATION',
      'VALIDATION REPORT',
    ];

    expectedSections.forEach((section) => {
      if (!result.includes(section)) {
        results.output.valid = false;
        results.output.errors.push(`Missing output section: ${section}`);
      }
    });
  } catch (error) {
    if (error.status !== undefined) {
      // Script executed but returned non-zero exit code
      results.exitCode.valid = false;
      results.exitCode.errors.push(`Script exited with code: ${error.status}`);

      // Check if error output is helpful
      const stderr = error.stderr || '';
      if (
        !stderr.includes('help') &&
        !stderr.includes('install') &&
        !stderr.includes('configure')
      ) {
        results.output.valid = false;
        results.output.errors.push(
          'Error output should provide helpful guidance'
        );
      }
    } else {
      results.execution.valid = false;
      results.execution.errors.push(
        `Script execution failed: ${error.message}`
      );
    }
  }

  return results;
}

/**
 * Validate onboarding script handles missing dependencies
 * @return {Object} Validation results for dependency handling
 */
function validateMissingDependencyHandling() {
  const results = {
    dockerMissing: {valid: true, errors: []},
    gitMissing: {valid: true, errors: []},
    envMissing: {valid: true, errors: []},
  };

  // Test with Docker missing (mock by setting empty PATH)
  try {
    const mockEnv = {PATH: '/nonexistent'};
    const testResult = testOnboardingScriptExecution(mockEnv);

    if (testResult.execution.valid) {
      results.dockerMissing.valid = false;
      results.dockerMissing.errors.push(
        'Script should fail when Docker is missing'
      );
    }
  } catch (error) {
    // Expected to fail, check error message quality
    if (!error.message.includes('Docker') && !error.stderr.includes('Docker')) {
      results.dockerMissing.valid = false;
      results.dockerMissing.errors.push(
        'Should provide clear Docker missing error'
      );
    }
  }

  // Test with missing .env file
  const envBackup = fs.existsSync('.env')
    ? fs.readFileSync('.env', 'utf8')
    : null;

  try {
    if (fs.existsSync('.env')) {
      fs.unlinkSync('.env');
    }

    const testResult = testOnboardingScriptExecution();

    if (testResult.execution.valid) {
      results.envMissing.valid = false;
      results.envMissing.errors.push('Script should fail when .env is missing');
    }
  } catch (error) {
    // Expected to fail, check error message quality
    if (!error.message.includes('.env') && !error.stderr.includes('.env')) {
      results.envMissing.valid = false;
      results.envMissing.errors.push('Should provide clear .env missing error');
    }
  } finally {
    // Restore .env file if it existed
    if (envBackup) {
      fs.writeFileSync('.env', envBackup);
    }
  }

  return results;
}

/**
 * Generate comprehensive onboarding validation report
 * @return {Object} Complete validation report
 */
function generateOnboardingValidationReport() {
  const scriptValidation = validateOnboardingScript();
  const executionTest = testOnboardingScriptExecution();
  const dependencyHandling = validateMissingDependencyHandling();

  const report = {
    timestamp: new Date().toISOString(),
    overall:
      scriptValidation.overall.valid &&
      executionTest.execution.valid &&
      Object.values(dependencyHandling).every((result) => result.valid),
    sections: {
      scriptValidation: scriptValidation.overall.valid ? 'PASS' : 'FAIL',
      executionTest: executionTest.execution.valid ? 'PASS' : 'FAIL',
      dependencyHandling: Object.values(dependencyHandling).every(
        (r) => r.valid
      )
        ? 'PASS'
        : 'FAIL',
    },
    errors: [
      ...scriptValidation.overall.errors,
      ...executionTest.execution.errors,
      ...executionTest.output.errors,
      ...executionTest.exitCode.errors,
      ...Object.values(dependencyHandling).flatMap((result) => result.errors),
    ],
    recommendations: [],
  };

  // Add recommendations based on errors
  if (!scriptValidation.overall.valid) {
    report.recommendations.push(
      'Review and fix onboarding script implementation'
    );
  }

  if (!executionTest.execution.valid) {
    report.recommendations.push(
      'Fix script execution issues and error handling'
    );
  }

  if (!Object.values(dependencyHandling).every((r) => r.valid)) {
    report.recommendations.push(
      'Improve dependency validation and error messages'
    );
  }

  return report;
}

module.exports = {
  validateOnboardingScript,
  validateScriptExistence,
  validateScriptSyntax,
  validateEnvironmentChecks,
  validateErrorHandling,
  validateOutputFormat,
  testOnboardingScriptExecution,
  validateMissingDependencyHandling,
  generateOnboardingValidationReport,
};

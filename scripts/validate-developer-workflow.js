#!/usr/bin/env node

/**
 * Developer workflow validation script
 * Validates all aspects of the developer workflow integration and documentation
 *
 * @fileoverview Comprehensive validation of developer workflow implementation
 * @author AI Voice Verification Agent Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const {
  validateDocumentationAccuracy,
} = require('../tests/support/documentation-validator');
const {validateIDEConfiguration} = require('../tests/support/ide-validator');
const {
  validateOnboardingScript,
} = require('../tests/support/onboarding-validator');

/**
 * ANSI color codes for console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Console logging utilities with colors
 */
const logger = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}🔧${colors.reset} ${msg}`),
  header: (msg) =>
    console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`),
};

/**
 * Validation results storage
 */
let validationResults = {
  documentation: {valid: false, errors: []},
  ideConfiguration: {valid: false, errors: []},
  onboardingScript: {valid: false, errors: []},
  qualityTools: {valid: false, errors: []},
  troubleshooting: {valid: false, errors: []},
  fileStructure: {valid: false, errors: []},
};

/**
 * Execute shell command and return result
 * @param {string} command - Command to execute
 * @param {boolean} silent - Whether to suppress output
 * @return {Object} Result object with stdout, stderr, and success
 */
function executeCommand(command, silent = true) {
  try {
    const stdout = execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return {stdout: stdout.trim(), stderr: '', success: true};
  } catch (error) {
    return {
      stdout: '',
      stderr: error.message,
      success: false,
      exitCode: error.status,
    };
  }
}

/**
 * Validate file exists and is readable
 * @param {string} filePath - Path to file
 * @return {boolean} True if file exists and is readable
 */
function validateFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate developer workflow file structure
 * @return {Object} Validation results
 */
function validateFileStructure() {
  logger.step('Validating developer workflow file structure...');

  const requiredFiles = [
    // Documentation files
    'docs/DEVELOPER-SETUP.md',
    'docs/TROUBLESHOOTING.md',
    'docs/IDE-SETUP.md',
    'docs/QUALITY-TOOLS.md',

    // Scripts
    'scripts/developer-onboarding.js',
    'scripts/validate-developer-workflow.js',

    // VS Code configuration
    '.vscode/settings.json',
    '.vscode/tasks.json',
    '.vscode/launch.json',
    '.vscode/extensions.json',

    // Test files
    'tests/features/developer-workflow.feature',
    'tests/steps/developer-workflow-steps.js',
    'tests/support/documentation-validator.js',
    'tests/support/ide-validator.js',
    'tests/support/onboarding-validator.js',
  ];

  const results = {valid: true, errors: [], missing: [], found: []};

  requiredFiles.forEach((filePath) => {
    if (validateFileExists(filePath)) {
      results.found.push(filePath);
      logger.success(`Found: ${filePath}`);
    } else {
      results.missing.push(filePath);
      results.valid = false;
      results.errors.push(`Missing required file: ${filePath}`);
      logger.error(`Missing: ${filePath}`);
    }
  });

  logger.info(
    `Found ${results.found.length}/${requiredFiles.length} required files`
  );

  return results;
}

/**
 * Validate documentation accuracy and completeness
 * @return {Object} Validation results
 */
function validateDocumentation() {
  logger.step('Validating documentation accuracy and completeness...');

  const documentationFiles = [
    'docs/DEVELOPER-SETUP.md',
    'docs/TROUBLESHOOTING.md',
    'docs/IDE-SETUP.md',
    'docs/QUALITY-TOOLS.md',
    'README.md',
  ];

  try {
    const validation = validateDocumentationAccuracy(documentationFiles);

    // Check each validation category
    Object.entries(validation).forEach(([category, result]) => {
      if (result.valid) {
        logger.success(`Documentation ${category}: PASS`);
      } else {
        logger.error(`Documentation ${category}: FAIL`);
        result.errors.forEach((error) => logger.error(`  - ${error}`));
      }
    });

    const overallValid = Object.values(validation).every(
      (result) => result.valid
    );

    return {
      valid: overallValid,
      errors: Object.values(validation).flatMap((result) => result.errors),
      details: validation,
    };
  } catch (error) {
    logger.error(`Documentation validation failed: ${error.message}`);
    return {
      valid: false,
      errors: [`Documentation validation error: ${error.message}`],
    };
  }
}

/**
 * Validate IDE configuration
 * @return {Object} Validation results
 */
function validateIDE() {
  logger.step('Validating IDE configuration...');

  try {
    const validation = validateIDEConfiguration();

    // Check each configuration category
    Object.entries(validation).forEach(([category, result]) => {
      if (category === 'overall') return;

      if (result.valid) {
        logger.success(`IDE ${category}: PASS`);
      } else {
        logger.error(`IDE ${category}: FAIL`);
        result.errors.forEach((error) => logger.error(`  - ${error}`));
      }
    });

    return {
      valid: validation.overall.valid,
      errors: validation.overall.errors,
      details: validation,
    };
  } catch (error) {
    logger.error(`IDE validation failed: ${error.message}`);
    return {
      valid: false,
      errors: [`IDE validation error: ${error.message}`],
    };
  }
}

/**
 * Validate onboarding script
 * @return {Object} Validation results
 */
function validateOnboarding() {
  logger.step('Validating developer onboarding script...');

  try {
    const validation = validateOnboardingScript();

    // Check each validation category
    Object.entries(validation).forEach(([category, result]) => {
      if (category === 'overall') return;

      if (result.valid) {
        logger.success(`Onboarding ${category}: PASS`);
      } else {
        logger.error(`Onboarding ${category}: FAIL`);
        result.errors.forEach((error) => logger.error(`  - ${error}`));
      }
    });

    return {
      valid: validation.overall.valid,
      errors: validation.overall.errors,
      details: validation,
    };
  } catch (error) {
    logger.error(`Onboarding validation failed: ${error.message}`);
    return {
      valid: false,
      errors: [`Onboarding validation error: ${error.message}`],
    };
  }
}

/**
 * Validate quality tools documentation and configuration
 * @return {Object} Validation results
 */
function validateQualityTools() {
  logger.step('Validating quality tools documentation and configuration...');

  const results = {valid: true, errors: []};

  // Check quality tools documentation
  if (!validateFileExists('docs/QUALITY-TOOLS.md')) {
    results.valid = false;
    results.errors.push('Missing quality tools documentation');
  } else {
    logger.success('Quality tools documentation exists');
  }

  // Check configuration files exist
  const configFiles = [
    '.eslintrc.js',
    '.prettierrc.js',
    'jest.config.js',
    'cucumber.js',
    '.lintstagedrc.json',
    '.husky/pre-commit',
    '.husky/pre-push',
  ];

  configFiles.forEach((configFile) => {
    if (validateFileExists(configFile)) {
      logger.success(`Configuration file exists: ${configFile}`);
    } else {
      results.valid = false;
      results.errors.push(`Missing configuration file: ${configFile}`);
      logger.error(`Missing configuration: ${configFile}`);
    }
  });

  // Validate package.json scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'lint',
      'lint:fix',
      'format',
      'format:check',
      'test:bdd',
      'test:coverage',
      'security:scan',
      'docs:generate',
      'quality:check',
    ];

    requiredScripts.forEach((script) => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        logger.success(`Package script exists: ${script}`);
      } else {
        results.valid = false;
        results.errors.push(`Missing package script: ${script}`);
        logger.error(`Missing script: ${script}`);
      }
    });
  } catch (error) {
    results.valid = false;
    results.errors.push(`Error reading package.json: ${error.message}`);
  }

  return results;
}

/**
 * Validate troubleshooting guide completeness
 * @return {Object} Validation results
 */
function validateTroubleshooting() {
  logger.step('Validating troubleshooting guide completeness...');

  const results = {valid: true, errors: []};

  if (!validateFileExists('docs/TROUBLESHOOTING.md')) {
    results.valid = false;
    results.errors.push('Missing troubleshooting guide');
    return results;
  }

  try {
    const content = fs.readFileSync('docs/TROUBLESHOOTING.md', 'utf8');

    // Required troubleshooting sections
    const requiredSections = [
      'Docker Issues',
      'Environment Configuration',
      'Quality Tools Issues',
      'Testing Problems',
      'Performance Issues',
      'IDE Configuration',
      'Git and Pre-commit Issues',
      'Database Issues',
      'Security Scanning Issues',
    ];

    requiredSections.forEach((section) => {
      if (content.includes(section)) {
        logger.success(`Troubleshooting section exists: ${section}`);
      } else {
        results.valid = false;
        results.errors.push(`Missing troubleshooting section: ${section}`);
        logger.error(`Missing section: ${section}`);
      }
    });

    // Check for Docker-only compliance in solutions
    const dockerCommands = content.match(/docker compose/g) || [];
    const forbiddenCommands = content.match(/^npm (?!.*docker)/gm) || [];

    if (forbiddenCommands.length > 0) {
      results.valid = false;
      results.errors.push(
        'Troubleshooting guide contains forbidden local npm commands'
      );
      logger.error(
        'Found forbidden local npm commands in troubleshooting guide'
      );
    }

    if (dockerCommands.length > 0) {
      logger.success(
        `Found ${dockerCommands.length} Docker commands in troubleshooting guide`
      );
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(
      `Error reading troubleshooting guide: ${error.message}`
    );
  }

  return results;
}

/**
 * Test BDD scenarios for developer workflow
 * @return {Object} Test results
 */
function testBDDScenarios() {
  logger.step('Testing BDD scenarios for developer workflow...');

  const results = {valid: true, errors: []};

  try {
    // Check if BDD test files exist
    if (!validateFileExists('tests/features/developer-workflow.feature')) {
      results.valid = false;
      results.errors.push('Missing developer workflow BDD feature file');
      return results;
    }

    if (!validateFileExists('tests/steps/developer-workflow-steps.js')) {
      results.valid = false;
      results.errors.push('Missing developer workflow BDD step definitions');
      return results;
    }

    // Validate feature file syntax
    const featureContent = fs.readFileSync(
      'tests/features/developer-workflow.feature',
      'utf8'
    );

    if (!featureContent.includes('Feature:')) {
      results.valid = false;
      results.errors.push('Invalid BDD feature file format');
    }

    if (!featureContent.includes('@pre-development')) {
      results.valid = false;
      results.errors.push('Missing required BDD tags');
    }

    // Count scenarios
    const scenarios = (featureContent.match(/Scenario:/g) || []).length;
    logger.success(`Found ${scenarios} BDD scenarios for developer workflow`);

    if (scenarios < 10) {
      results.valid = false;
      results.errors.push('Insufficient BDD scenario coverage');
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`BDD validation error: ${error.message}`);
  }

  return results;
}

/**
 * Generate comprehensive validation report
 */
function generateValidationReport() {
  logger.header('🎯 DEVELOPER WORKFLOW VALIDATION REPORT');

  console.log('Validation Summary:');
  Object.entries(validationResults).forEach(([category, result]) => {
    const status = result.valid ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${category}: ${status}`);
  });

  const overallValid = Object.values(validationResults).every(
    (result) => result.valid
  );

  console.log('\nDetailed Results:');
  Object.entries(validationResults).forEach(([category, result]) => {
    if (!result.valid && result.errors.length > 0) {
      console.log(`\n${category} Errors:`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }
  });

  if (overallValid) {
    logger.success('🎉 All developer workflow validations passed!');
    console.log('\nDeveloper workflow is properly implemented and documented.');
    console.log('\nNext steps:');
    console.log(
      '  1. Run BDD tests: docker compose run --rm bdd-runner npm run test:bdd:developer-workflow'
    );
    console.log('  2. Test onboarding: node scripts/developer-onboarding.js');
    console.log('  3. Validate IDE setup: Open project in VS Code');
  } else {
    logger.error('❌ Some developer workflow validations failed.');
    console.log('\nPlease fix the issues above before proceeding.');
    console.log('\nFor help:');
    console.log(
      '  - Review task requirements in .kiro/specs/pre-development-setup/tasks.md'
    );
    console.log(
      '  - Check implementation guidelines in .kiro/specs/pre-development-setup/design.md'
    );
    console.log('  - Consult troubleshooting guide: docs/TROUBLESHOOTING.md');
  }

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    overall: overallValid,
    results: validationResults,
    summary: {
      total: Object.keys(validationResults).length,
      passed: Object.values(validationResults).filter((r) => r.valid).length,
      failed: Object.values(validationResults).filter((r) => !r.valid).length,
    },
  };

  try {
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports', {recursive: true});
    }
    fs.writeFileSync(
      'reports/developer-workflow-validation.json',
      JSON.stringify(report, null, 2)
    );
    logger.success(
      'Validation report saved to reports/developer-workflow-validation.json'
    );
  } catch (error) {
    logger.warning(`Could not save validation report: ${error.message}`);
  }

  return overallValid;
}

/**
 * Main validation function
 */
async function main() {
  logger.header('🚀 DEVELOPER WORKFLOW VALIDATION');

  console.log(
    'This script validates the complete developer workflow implementation.'
  );
  console.log('All components must pass validation for task 16 completion.\n');

  // Run all validations
  logger.header('📋 RUNNING VALIDATIONS');

  validationResults.fileStructure = validateFileStructure();
  validationResults.documentation = validateDocumentation();
  validationResults.ideConfiguration = validateIDE();
  validationResults.onboardingScript = validateOnboarding();
  validationResults.qualityTools = validateQualityTools();
  validationResults.troubleshooting = validateTroubleshooting();

  // Test BDD scenarios
  logger.header('🧪 TESTING BDD SCENARIOS');
  const bddResults = testBDDScenarios();
  validationResults.bddScenarios = bddResults;

  // Generate final report
  const success = generateValidationReport();

  process.exit(success ? 0 : 1);
}

// Run the validation script
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  validateFileStructure,
  validateDocumentation,
  validateIDE,
  validateOnboarding,
  validateQualityTools,
  validateTroubleshooting,
  testBDDScenarios,
  generateValidationReport,
};

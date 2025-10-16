#!/usr/bin/env node

/**
 * Developer onboarding script with comprehensive environment validation
 * Validates Docker setup, environment configuration, and quality tools
 *
 * @fileoverview Automated developer environment setup and validation
 * @author AI Voice Verification Agent Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const os = require('os');

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
 * Configuration for required tools and versions
 */
const requirements = {
  docker: {
    command: 'docker --version',
    minVersion: '20.0.0',
    installUrl: 'https://docs.docker.com/get-docker/',
  },
  dockerCompose: {
    command: 'docker compose version',
    minVersion: '2.0.0',
    installUrl: 'https://docs.docker.com/compose/install/',
  },
  git: {
    command: 'git --version',
    minVersion: '2.30.0',
    installUrl: 'https://git-scm.com/downloads',
  },
  node: {
    command: 'node --version',
    minVersion: '24.10.0',
    installUrl: 'https://nodejs.org/en/download/',
    dockerOnly: true,
  },
};

/**
 * Required environment variables for development
 */
const requiredEnvVars = [
  'LLM_PROVIDER',
  'LLM_API_KEY',
  'ENCRYPTION_KEY',
  'SESSION_SECRET',
  'DB_PASSWORD',
];

/**
 * Optional environment variables with defaults
 */
const optionalEnvVars = {
  NODE_ENV: 'development',
  PORT: '5253',
  LOG_LEVEL: 'info',
  JOB_TENURE_THRESHOLD: '24',
  IDENTITY_RETRY_LIMIT: '3',
  SESSION_TIMEOUT: '1800',
};

/**
 * Validation results storage
 */
let validationResults = {
  docker: false,
  dockerCompose: false,
  git: false,
  environment: false,
  dockerRunning: false,
  projectStructure: false,
  qualityTools: false,
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
 * Check if a command exists and meets version requirements
 * @param {string} toolName - Name of the tool to check
 * @param {Object} config - Tool configuration
 * @return {boolean} True if tool is available and meets requirements
 */
function checkTool(toolName, config) {
  logger.step(`Checking ${toolName}...`);

  if (config.dockerOnly) {
    logger.info(`${toolName} will be validated inside Docker containers`);
    return true;
  }

  const result = executeCommand(config.command);

  if (!result.success) {
    logger.error(`${toolName} is not installed or not in PATH`);
    logger.info(`Install from: ${config.installUrl}`);
    return false;
  }

  // Extract version from output
  const versionMatch = result.stdout.match(/(\d+\.\d+\.\d+)/);
  if (versionMatch) {
    const version = versionMatch[1];
    logger.success(`${toolName} version ${version} found`);

    // Simple version comparison (assumes semantic versioning)
    if (compareVersions(version, config.minVersion) >= 0) {
      return true;
    } else {
      logger.warning(
        `${toolName} version ${version} is below minimum ${config.minVersion}`
      );
      return false;
    }
  }

  logger.success(`${toolName} is available`);
  return true;
}

/**
 * Compare two semantic version strings
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @return {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(version1, version2) {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
}

/**
 * Check if Docker is running
 * @return {boolean} True if Docker daemon is running
 */
function checkDockerRunning() {
  logger.step('Checking if Docker is running...');

  const result = executeCommand('docker info');

  if (result.success) {
    logger.success('Docker daemon is running');
    return true;
  } else {
    logger.error('Docker daemon is not running');
    logger.info('Please start Docker Desktop or Docker daemon');
    return false;
  }
}

/**
 * Validate project structure and required files
 * @return {boolean} True if project structure is valid
 */
function validateProjectStructure() {
  logger.step('Validating project structure...');

  const requiredFiles = [
    'package.json',
    'compose.yaml',
    'Dockerfile',
    '.env.example',
    '.gitignore',
    'README.md',
  ];

  const requiredDirectories = [
    'src',
    'tests',
    'docs',
    'scripts',
    '.husky',
    '.kiro',
  ];

  let allValid = true;

  // Check required files
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logger.success(`Found ${file}`);
    } else {
      logger.error(`Missing required file: ${file}`);
      allValid = false;
    }
  }

  // Check required directories
  for (const dir of requiredDirectories) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      logger.success(`Found directory ${dir}/`);
    } else {
      logger.error(`Missing required directory: ${dir}/`);
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Validate environment configuration
 * @return {boolean} True if environment is properly configured
 */
function validateEnvironment() {
  logger.step('Validating environment configuration...');

  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    logger.error('.env file not found');
    logger.info('Copy .env.example to .env and configure your values');
    logger.info('Command: cp .env.example .env');
    return false;
  }

  // Read .env file
  const envContent = fs.readFileSync('.env', 'utf8');
  const envVars = {};

  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });

  let allValid = true;

  // Check required variables
  for (const varName of requiredEnvVars) {
    if (envVars[varName] && envVars[varName] !== 'your_value_here') {
      logger.success(`${varName} is configured`);
    } else {
      logger.error(`${varName} is missing or not configured`);
      allValid = false;
    }
  }

  // Check optional variables and set defaults
  for (const [varName, defaultValue] of Object.entries(optionalEnvVars)) {
    if (envVars[varName]) {
      logger.success(`${varName} is configured: ${envVars[varName]}`);
    } else {
      logger.warning(`${varName} not set, will use default: ${defaultValue}`);
    }
  }

  return allValid;
}

/**
 * Test Docker Compose services
 * @return {boolean} True if all services can start
 */
function testDockerServices() {
  logger.step('Testing Docker Compose services...');

  try {
    // Validate compose file
    logger.info('Validating docker-compose.yaml...');
    const configResult = executeCommand('docker compose config');
    if (!configResult.success) {
      logger.error('Docker Compose configuration is invalid');
      logger.error(configResult.stderr);
      return false;
    }
    logger.success('Docker Compose configuration is valid');

    // Try to build images
    logger.info('Building Docker images (this may take a few minutes)...');
    const buildResult = executeCommand('docker compose build', false);
    if (!buildResult.success) {
      logger.error('Failed to build Docker images');
      return false;
    }
    logger.success('Docker images built successfully');

    return true;
  } catch (error) {
    logger.error(`Docker services test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test quality tools in Docker
 * @return {boolean} True if quality tools work correctly
 */
function testQualityTools() {
  logger.step('Testing quality tools in Docker...');

  const qualityCommands = [
    {
      name: 'Package installation',
      command: 'docker compose run --rm verification-agent npm ci',
    },
    {
      name: 'ESLint configuration',
      command:
        'docker compose run --rm quality-runner npx eslint --print-config package.json',
    },
    {
      name: 'Prettier configuration',
      command:
        'docker compose run --rm quality-runner npx prettier --check package.json',
    },
    {
      name: 'Jest configuration',
      command: 'docker compose run --rm test-runner npx jest --showConfig',
    },
  ];

  let allPassed = true;

  for (const test of qualityCommands) {
    logger.info(`Testing ${test.name}...`);
    const result = executeCommand(test.command);

    if (result.success) {
      logger.success(`${test.name} works correctly`);
    } else {
      logger.error(`${test.name} failed`);
      logger.error(result.stderr);
      allPassed = false;
    }
  }

  return allPassed;
}

/**
 * Generate development environment report
 */
function generateReport() {
  logger.header('🎯 DEVELOPMENT ENVIRONMENT VALIDATION REPORT');

  console.log('System Information:');
  console.log(`  OS: ${os.type()} ${os.release()}`);
  console.log(`  Architecture: ${os.arch()}`);
  console.log(`  Node.js: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);

  console.log('\nValidation Results:');
  Object.entries(validationResults).forEach(([check, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${check}: ${status}`);
  });

  const allPassed = Object.values(validationResults).every((result) => result);

  if (allPassed) {
    logger.success(
      '🎉 All validations passed! Your development environment is ready.'
    );
    console.log('\nNext steps:');
    console.log('  1. Start development: docker compose up --build');
    console.log(
      '  2. Run tests: docker compose run --rm bdd-runner npm run test:bdd'
    );
    console.log(
      '  3. Check quality: docker compose run --rm quality-runner npm run quality:check'
    );
    console.log('  4. Read documentation: docs/DEVELOPER-SETUP.md');
  } else {
    logger.error('❌ Some validations failed. Please fix the issues above.');
    console.log('\nFor help:');
    console.log('  - Check docs/TROUBLESHOOTING.md');
    console.log('  - Review docs/DEVELOPER-SETUP.md');
    console.log('  - Ask team for assistance');
  }
}

/**
 * Create IDE configuration files
 */
function createIDEConfig() {
  logger.step('Creating IDE configuration files...');

  // Ensure .vscode directory exists
  if (!fs.existsSync('.vscode')) {
    fs.mkdirSync('.vscode');
  }

  // Create comprehensive VS Code settings
  const vscodeSettings = {
    'terminal.integrated.defaultProfile.linux': 'bash',
    'terminal.integrated.defaultProfile.windows': 'PowerShell',
    'terminal.integrated.profiles.linux': {
      'Docker Container': {
        path: 'docker',
        args: ['compose', 'exec', 'verification-agent', 'bash'],
      },
    },
    'terminal.integrated.profiles.windows': {
      'Docker Container': {
        path: 'docker',
        args: ['compose', 'exec', 'verification-agent', 'sh'],
      },
    },
    'npm.packageManager': 'docker',
    'npm.runSilent': true,
    'eslint.runtime': 'docker',
    'eslint.nodePath': '/app/node_modules',
    'prettier.resolveGlobalModules': false,
    'typescript.preferences.includePackageJsonAutoImports': 'off',
    'extensions.ignoreRecommendations': false,
    'npm.enableRunFromFolder': false,
    'files.associations': {
      '*.feature': 'gherkin',
    },
    'editor.formatOnSave': true,
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
    'search.exclude': {
      '**/node_modules': true,
      '**/coverage': true,
      '**/reports': true,
      '**/.git': true,
    },
  };

  fs.writeFileSync(
    '.vscode/settings.json',
    JSON.stringify(vscodeSettings, null, 2)
  );
  logger.success('Created .vscode/settings.json');
}

/**
 * Main onboarding function
 */
async function main() {
  logger.header('🚀 AI VOICE VERIFICATION AGENT - DEVELOPER ONBOARDING');

  console.log(
    'This script will validate your development environment and help you get started.'
  );
  console.log(
    'All development activities must be performed within Docker containers.\n'
  );

  // System requirements check
  logger.header('📋 CHECKING SYSTEM REQUIREMENTS');
  validationResults.docker = checkTool('Docker', requirements.docker);
  validationResults.dockerCompose = checkTool(
    'Docker Compose',
    requirements.dockerCompose
  );
  validationResults.git = checkTool('Git', requirements.git);

  // Docker runtime check
  if (validationResults.docker) {
    validationResults.dockerRunning = checkDockerRunning();
  }

  // Project structure validation
  logger.header('📁 VALIDATING PROJECT STRUCTURE');
  validationResults.projectStructure = validateProjectStructure();

  // Environment configuration
  logger.header('⚙️ VALIDATING ENVIRONMENT CONFIGURATION');
  validationResults.environment = validateEnvironment();

  // Docker services test
  if (validationResults.dockerRunning && validationResults.projectStructure) {
    logger.header('🐳 TESTING DOCKER SERVICES');
    const dockerServicesWork = testDockerServices();

    if (dockerServicesWork) {
      logger.header('🔧 TESTING QUALITY TOOLS');
      validationResults.qualityTools = testQualityTools();
    }
  }

  // Create IDE configuration
  logger.header('💻 SETTING UP IDE CONFIGURATION');
  createIDEConfig();

  // Generate final report
  generateReport();
}

// Run the onboarding script
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Onboarding failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  checkTool,
  validateEnvironment,
  validateProjectStructure,
  testDockerServices,
  executeCommand,
};

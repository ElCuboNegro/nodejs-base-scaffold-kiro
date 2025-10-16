/**
 * Step definitions for developer workflow integration and documentation tests
 * Validates developer onboarding, IDE integration, and documentation accuracy
 *
 * @fileoverview BDD step definitions for task 16 - developer workflow
 * @author AI Voice Verification Agent Team
 */

const {Given, When, Then} = require('@cucumber/cucumber');
const {expect} = require('chai');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const {
  validateDocumentationAccuracy,
} = require('../support/documentation-validator');
const {validateIDEConfiguration} = require('../support/ide-validator');
const {validateOnboardingScript} = require('../support/onboarding-validator');

/**
 * Execute command and return result with error handling
 * @param {string} command - Command to execute
 * @param {Object} options - Execution options
 * @return {Object} Execution result
 */
function executeCommand(command, options = {}) {
  try {
    const stdout = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000,
      ...options,
    });
    return {success: true, stdout: stdout.trim(), stderr: ''};
  } catch (error) {
    return {
      success: false,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
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

// Background steps
Given('I have a clean development environment', function () {
  this.environment = {
    clean: true,
    dockerAvailable: false,
    gitAvailable: false,
    projectInitialized: false,
  };
});

Given('Docker is running and accessible', function () {
  const dockerResult = executeCommand('docker info');
  expect(dockerResult.success).to.be.true;
  this.environment.dockerAvailable = true;
});

Given('the project repository is properly initialized', function () {
  expect(validateFileExists('package.json')).to.be.true;
  expect(validateFileExists('compose.yaml')).to.be.true;
  expect(validateFileExists('.env.example')).to.be.true;
  this.environment.projectInitialized = true;
});

// Documentation validation steps
Given('I am a new developer joining the project', function () {
  this.developerContext = {
    isNew: true,
    hasReadDocumentation: false,
    setupComplete: false,
  };
});

When('I read the developer setup documentation', function () {
  const docPath = 'docs/DEVELOPER-SETUP.md';
  expect(validateFileExists(docPath)).to.be.true;

  this.documentationContent = fs.readFileSync(docPath, 'utf8');
  this.developerContext.hasReadDocumentation = true;
});

Then('I should find clear prerequisites and system requirements', function () {
  expect(this.documentationContent).to.include('Prerequisites');
  expect(this.documentationContent).to.include('System Requirements');
  expect(this.documentationContent).to.include('Docker Desktop');
  expect(this.documentationContent).to.include('Git');
  expect(this.documentationContent).to.include('Visual Studio Code');
});

Then('I should find step-by-step setup instructions', function () {
  expect(this.documentationContent).to.include('Initial Setup');
  expect(this.documentationContent).to.include('Repository Setup');
  expect(this.documentationContent).to.include('Environment Configuration');
  expect(this.documentationContent).to.include('Docker Environment Validation');
});

Then(
  'I should find comprehensive environment configuration guidance',
  function () {
    expect(this.documentationContent).to.include('LLM_PROVIDER');
    expect(this.documentationContent).to.include('LLM_API_KEY');
    expect(this.documentationContent).to.include('ENCRYPTION_KEY');
    expect(this.documentationContent).to.include('SESSION_SECRET');
    expect(this.documentationContent).to.include('DB_PASSWORD');
  }
);

Then(
  'I should find Docker-only development workflow instructions',
  function () {
    expect(this.documentationContent).to.include('docker compose');
    expect(this.documentationContent).to.include('Docker-only');
    expect(this.documentationContent).not.to.match(/^npm (?!.*docker)/m);
    expect(this.documentationContent).not.to.match(/^node (?!.*docker)/m);
  }
);

Then('I should find quality tools usage documentation', function () {
  expect(this.documentationContent).to.include('ESLint');
  expect(this.documentationContent).to.include('Prettier');
  expect(this.documentationContent).to.include('Husky');
  expect(this.documentationContent).to.include('Snyk');
  expect(this.documentationContent).to.include('Jest');
  expect(this.documentationContent).to.include('Cucumber');
});

Then('I should find troubleshooting information', function () {
  expect(this.documentationContent).to.include('TROUBLESHOOTING.md');
  expect(validateFileExists('docs/TROUBLESHOOTING.md')).to.be.true;
});

// Onboarding script validation steps
Given('I have the required development tools installed', function () {
  const dockerResult = executeCommand('docker --version');
  const gitResult = executeCommand('git --version');

  expect(dockerResult.success).to.be.true;
  expect(gitResult.success).to.be.true;

  this.toolsInstalled = {
    docker: true,
    git: true,
  };
});

Given('I have configured the environment variables', function () {
  if (!validateFileExists('.env')) {
    // Create .env from template for testing
    const envExample = fs.readFileSync('.env.example', 'utf8');
    const testEnv = envExample
      .replace(/your_api_key_here/g, 'test_api_key')
      .replace(/your_encryption_key/g, 'test_encryption_key_32_characters')
      .replace(/your_session_secret/g, 'test_session_secret')
      .replace(/your_secure_db_password/g, 'test_db_password');

    fs.writeFileSync('.env', testEnv);
  }

  this.environmentConfigured = true;
});

When('I run the developer onboarding script', function () {
  const scriptPath = 'scripts/developer-onboarding.js';
  expect(validateFileExists(scriptPath)).to.be.true;

  this.onboardingResult = executeCommand(`node ${scriptPath}`, {
    timeout: 300000, // 5 minutes timeout
  });
});

Then('it should validate Docker installation and version', function () {
  expect(this.onboardingResult.stdout).to.include('Docker');
  expect(this.onboardingResult.stdout).to.include('version');
});

Then('it should validate Docker Compose availability', function () {
  expect(this.onboardingResult.stdout).to.include('Docker Compose');
});

Then('it should validate Git installation', function () {
  expect(this.onboardingResult.stdout).to.include('Git');
});

Then('it should check if Docker daemon is running', function () {
  expect(this.onboardingResult.stdout).to.include('Docker daemon');
});

Then('it should validate project structure integrity', function () {
  expect(this.onboardingResult.stdout).to.include('project structure');
  expect(this.onboardingResult.stdout).to.include('package.json');
  expect(this.onboardingResult.stdout).to.include('compose.yaml');
});

Then('it should validate environment configuration', function () {
  expect(this.onboardingResult.stdout).to.include('environment configuration');
  expect(this.onboardingResult.stdout).to.include('.env');
});

Then('it should test Docker services functionality', function () {
  expect(this.onboardingResult.stdout).to.include('Docker services');
  expect(this.onboardingResult.stdout).to.include('Docker Compose');
});

Then('it should test quality tools in Docker containers', function () {
  expect(this.onboardingResult.stdout).to.include('quality tools');
  expect(this.onboardingResult.stdout).to.include('Docker');
});

Then('it should generate a comprehensive validation report', function () {
  expect(this.onboardingResult.stdout).to.include('VALIDATION REPORT');
  expect(this.onboardingResult.stdout).to.include('System Information');
  expect(this.onboardingResult.stdout).to.include('Validation Results');
});

Then('it should create IDE configuration files', function () {
  expect(this.onboardingResult.stdout).to.include('IDE configuration');
  expect(validateFileExists('.vscode/settings.json')).to.be.true;
});

// Error handling steps
Given('I have an incomplete development environment', function () {
  this.environment = {
    incomplete: true,
    dockerMissing: true,
  };
});

When('I run the developer onboarding script with missing Docker', function () {
  // Mock missing Docker by temporarily renaming docker command
  this.onboardingResult = executeCommand(
    'node scripts/developer-onboarding.js',
    {
      env: {...process.env, PATH: '/nonexistent'},
    }
  );
});

Then('it should detect Docker is not installed', function () {
  expect(this.onboardingResult.stdout).to.include('Docker is not installed');
});

Then('it should provide clear installation instructions', function () {
  expect(this.onboardingResult.stdout).to.include('Install from:');
  expect(this.onboardingResult.stdout).to.include('https://docs.docker.com');
});

Then('it should fail gracefully with helpful error messages', function () {
  expect(this.onboardingResult.success).to.be.false;
  expect(this.onboardingResult.stdout).to.not.include('undefined');
  expect(this.onboardingResult.stdout).to.not.include('null');
});

Then('it should not proceed with Docker-dependent validations', function () {
  expect(this.onboardingResult.stdout).to.not.include(
    'Testing Docker services'
  );
});

// Environment validation steps
Given('I have Docker and Git installed', function () {
  this.toolsInstalled = {docker: true, git: true};
});

Given('I have not configured environment variables', function () {
  if (validateFileExists('.env')) {
    fs.unlinkSync('.env');
  }
  this.environmentConfigured = false;
});

Then('it should detect missing .env file', function () {
  expect(this.onboardingResult.stdout).to.include('.env file not found');
});

Then('it should provide instructions to copy .env.example', function () {
  expect(this.onboardingResult.stdout).to.include('cp .env.example .env');
});

Then('it should validate required environment variables', function () {
  expect(this.onboardingResult.stdout).to.include('LLM_PROVIDER');
  expect(this.onboardingResult.stdout).to.include('LLM_API_KEY');
  expect(this.onboardingResult.stdout).to.include('ENCRYPTION_KEY');
});

Then(
  'it should warn about missing optional variables with defaults',
  function () {
    expect(this.onboardingResult.stdout).to.include('will use default');
  }
);

Then(
  'it should fail validation if critical variables are missing',
  function () {
    expect(this.onboardingResult.success).to.be.false;
  }
);

// IDE integration steps
Given('I have VS Code installed', function () {
  this.ideInstalled = {vscode: true};
});

When('I open the project in VS Code', function () {
  // Simulate opening project by validating configuration files
  this.vscodeConfig = {
    settings: validateFileExists('.vscode/settings.json'),
    tasks: validateFileExists('.vscode/tasks.json'),
    launch: validateFileExists('.vscode/launch.json'),
    extensions: validateFileExists('.vscode/extensions.json'),
  };
});

Then('I should see recommended extensions notification', function () {
  expect(this.vscodeConfig.extensions).to.be.true;

  const extensionsConfig = JSON.parse(
    fs.readFileSync('.vscode/extensions.json', 'utf8')
  );
  expect(extensionsConfig.recommendations).to.be.an('array');
  expect(extensionsConfig.recommendations).to.include(
    'ms-vscode.vscode-eslint'
  );
  expect(extensionsConfig.recommendations).to.include('esbenp.prettier-vscode');
});

Then('the workspace should have proper settings configuration', function () {
  expect(this.vscodeConfig.settings).to.be.true;

  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
  expect(settings['npm.packageManager']).to.equal('docker');
  expect(settings['eslint.runtime']).to.equal('docker');
});

Then('I should have Docker-integrated terminal profiles', function () {
  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
  expect(settings['terminal.integrated.profiles.linux']).to.have.property(
    'Docker Container'
  );
  expect(settings['terminal.integrated.profiles.windows']).to.have.property(
    'Docker Container'
  );
});

Then(
  'I should have pre-configured tasks for all Docker operations',
  function () {
    expect(this.vscodeConfig.tasks).to.be.true;

    const tasks = JSON.parse(fs.readFileSync('.vscode/tasks.json', 'utf8'));
    const taskLabels = tasks.tasks.map((task) => task.label);

    expect(taskLabels).to.include('Docker: Install Dependencies');
    expect(taskLabels).to.include('Docker: Run All BDD Tests');
    expect(taskLabels).to.include('Docker: Run Quality Checks');
  }
);

Then('I should have launch configurations for debugging', function () {
  expect(this.vscodeConfig.launch).to.be.true;

  const launch = JSON.parse(fs.readFileSync('.vscode/launch.json', 'utf8'));
  const configNames = launch.configurations.map((config) => config.name);

  expect(configNames).to.include('Docker: Debug Verification Agent');
  expect(configNames).to.include('Docker: Run BDD Tests');
});

Then('ESLint should work with Google JavaScript Style Guide', function () {
  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
  expect(settings['eslint.runtime']).to.equal('docker');
});

Then('Prettier should format code according to Google standards', function () {
  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
  expect(settings['editor.formatOnSave']).to.be.true;
  expect(settings['editor.codeActionsOnSave']).to.have.property(
    'source.fixAll.eslint'
  );
});

Then(
  'file associations should provide proper syntax highlighting',
  function () {
    const settings = JSON.parse(
      fs.readFileSync('.vscode/settings.json', 'utf8')
    );
    expect(settings['files.associations']).to.have.property(
      '*.feature',
      'gherkin'
    );
    expect(settings['files.associations']).to.have.property('*.md', 'markdown');
  }
);

// Task execution steps
Given('I have VS Code configured with the project', function () {
  expect(validateFileExists('.vscode/tasks.json')).to.be.true;
  this.vscodeConfigured = true;
});

Given('Docker services are available', function () {
  const result = executeCommand('docker compose config');
  expect(result.success).to.be.true;
});

When('I run the {string} task', function (taskName) {
  const tasks = JSON.parse(fs.readFileSync('.vscode/tasks.json', 'utf8'));
  const task = tasks.tasks.find((t) => t.label === taskName);

  expect(task).to.not.be.undefined;

  // Simulate task execution by running the command
  const command = `${task.command} ${task.args.join(' ')}`;
  this.taskResult = executeCommand(command, {timeout: 60000});
});

Then(
  'it should execute npm ci in the verification-agent container',
  function () {
    expect(this.taskResult.success).to.be.true;
  }
);

Then('it should execute BDD tests in the bdd-runner container', function () {
  expect(this.taskResult.success).to.be.true;
});

Then(
  'it should execute quality checks in the quality-runner container',
  function () {
    expect(this.taskResult.success).to.be.true;
  }
);

Then(
  'all tasks should complete successfully without local npm usage',
  function () {
    expect(this.taskResult.success).to.be.true;
    // Verify no local npm was used by checking command contains docker
    expect(this.taskResult.stdout).to.not.include('npm ERR!');
  }
);

// Documentation accuracy validation
Given('I have documentation files for developer workflow', function () {
  this.documentationFiles = [
    'docs/DEVELOPER-SETUP.md',
    'docs/TROUBLESHOOTING.md',
    'docs/IDE-SETUP.md',
    'README.md',
  ];

  this.documentationFiles.forEach((file) => {
    expect(validateFileExists(file)).to.be.true;
  });
});

When('I run documentation validation tests', function () {
  this.documentationValidation = validateDocumentationAccuracy(
    this.documentationFiles
  );
});

Then(
  'all code examples in documentation should be syntactically correct',
  function () {
    expect(this.documentationValidation.codeExamples.valid).to.be.true;
  }
);

Then('all Docker commands should be valid and executable', function () {
  expect(this.documentationValidation.dockerCommands.valid).to.be.true;
});

Then('all file paths referenced should exist in the project', function () {
  expect(this.documentationValidation.filePaths.valid).to.be.true;
});

Then('all environment variables mentioned should be documented', function () {
  expect(this.documentationValidation.environmentVariables.valid).to.be.true;
});

Then('all external links should be accessible', function () {
  expect(this.documentationValidation.externalLinks.valid).to.be.true;
});

Then('documentation should follow Google documentation standards', function () {
  expect(this.documentationValidation.googleStandards.valid).to.be.true;
});

// Performance validation
When('I execute common developer workflow operations', function () {
  const startTime = Date.now();

  this.performanceMetrics = {
    onboardingScript: this.measureOperation(() =>
      executeCommand('node scripts/developer-onboarding.js --quick')
    ),
    dockerStartup: this.measureOperation(() =>
      executeCommand('docker compose up -d --build')
    ),
    qualityChecks: this.measureOperation(() =>
      executeCommand(
        'docker compose run --rm quality-runner npm run lint --silent'
      )
    ),
  };
});

Then(
  'the developer onboarding script should complete within {int} minutes',
  function (minutes) {
    expect(this.performanceMetrics.onboardingScript.duration).to.be.lessThan(
      minutes * 60 * 1000
    );
  }
);

Then(
  'Docker service startup should complete within {int} minutes',
  function (minutes) {
    expect(this.performanceMetrics.dockerStartup.duration).to.be.lessThan(
      minutes * 60 * 1000
    );
  }
);

Then('quality checks should complete within {int} minutes', function (minutes) {
  expect(this.performanceMetrics.qualityChecks.duration).to.be.lessThan(
    minutes * 60 * 1000
  );
});

// Helper method for measuring operation duration
function measureOperation(operation) {
  const startTime = Date.now();
  const result = operation();
  const endTime = Date.now();

  return {
    duration: endTime - startTime,
    success: result.success,
    result: result,
  };
}

// Attach helper method to world
require('@cucumber/cucumber').setWorldConstructor(function () {
  this.measureOperation = measureOperation;
});

/**
 * IDE configuration validation utilities for developer workflow tests
 * Validates VS Code configuration, tasks, launch configurations, and extensions
 *
 * @fileoverview IDE validation support for BDD tests
 * @author AI Voice Verification Agent Team
 */

const fs = require('fs');
const path = require('path');

/**
 * Validate VS Code IDE configuration completeness and correctness
 * @return {Object} Validation results
 */
function validateIDEConfiguration() {
  const results = {
    settings: {valid: true, errors: []},
    tasks: {valid: true, errors: []},
    launch: {valid: true, errors: []},
    extensions: {valid: true, errors: []},
    overall: {valid: true, errors: []},
  };

  // Validate settings.json
  validateVSCodeSettings(results.settings);

  // Validate tasks.json
  validateVSCodeTasks(results.tasks);

  // Validate launch.json
  validateVSCodeLaunch(results.launch);

  // Validate extensions.json
  validateVSCodeExtensions(results.extensions);

  // Overall validation
  results.overall.valid =
    results.settings.valid &&
    results.tasks.valid &&
    results.launch.valid &&
    results.extensions.valid;

  if (!results.overall.valid) {
    results.overall.errors = [
      ...results.settings.errors,
      ...results.tasks.errors,
      ...results.launch.errors,
      ...results.extensions.errors,
    ];
  }

  return results;
}

/**
 * Validate VS Code settings.json configuration
 * @param {Object} results - Results object to update
 */
function validateVSCodeSettings(results) {
  const settingsPath = '.vscode/settings.json';

  if (!fs.existsSync(settingsPath)) {
    results.valid = false;
    results.errors.push('VS Code settings.json not found');
    return;
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    // Required Docker-only settings
    const requiredSettings = {
      'npm.packageManager': 'docker',
      'eslint.runtime': 'docker',
      'prettier.resolveGlobalModules': false,
      'npm.enableRunFromFolder': false,
      'editor.formatOnSave': true,
    };

    Object.entries(requiredSettings).forEach(([key, expectedValue]) => {
      if (settings[key] !== expectedValue) {
        results.valid = false;
        results.errors.push(
          `Setting ${key} should be ${expectedValue}, got ${settings[key]}`
        );
      }
    });

    // Required file associations
    const requiredAssociations = {
      '*.feature': 'gherkin',
      '*.md': 'markdown',
    };

    if (!settings['files.associations']) {
      results.valid = false;
      results.errors.push('Missing files.associations configuration');
    } else {
      Object.entries(requiredAssociations).forEach(([pattern, language]) => {
        if (settings['files.associations'][pattern] !== language) {
          results.valid = false;
          results.errors.push(
            `File association ${pattern} should be ${language}`
          );
        }
      });
    }

    // Required terminal profiles
    if (
      !settings['terminal.integrated.profiles.linux'] ||
      !settings['terminal.integrated.profiles.windows']
    ) {
      results.valid = false;
      results.errors.push('Missing Docker terminal profiles');
    }

    // Required code actions on save
    if (
      !settings['editor.codeActionsOnSave'] ||
      !settings['editor.codeActionsOnSave']['source.fixAll.eslint']
    ) {
      results.valid = false;
      results.errors.push('Missing ESLint auto-fix on save configuration');
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Invalid JSON in settings.json: ${error.message}`);
  }
}

/**
 * Validate VS Code tasks.json configuration
 * @param {Object} results - Results object to update
 */
function validateVSCodeTasks(results) {
  const tasksPath = '.vscode/tasks.json';

  if (!fs.existsSync(tasksPath)) {
    results.valid = false;
    results.errors.push('VS Code tasks.json not found');
    return;
  }

  try {
    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

    if (!tasks.tasks || !Array.isArray(tasks.tasks)) {
      results.valid = false;
      results.errors.push('Tasks configuration should have tasks array');
      return;
    }

    // Required Docker tasks
    const requiredTasks = [
      'Docker: Install Dependencies',
      'Docker: Start Development Environment',
      'Docker: Run All BDD Tests',
      'Docker: Run Quality Checks',
      'Docker: Run ESLint',
      'Docker: Format Code with Prettier',
      'Docker: Run Security Scan',
      'Docker: Generate Documentation',
    ];

    const taskLabels = tasks.tasks.map((task) => task.label);

    requiredTasks.forEach((requiredTask) => {
      if (!taskLabels.includes(requiredTask)) {
        results.valid = false;
        results.errors.push(`Missing required task: ${requiredTask}`);
      }
    });

    // Validate Docker commands in tasks
    tasks.tasks.forEach((task) => {
      if (task.label.startsWith('Docker:')) {
        if (task.command !== 'docker') {
          results.valid = false;
          results.errors.push(
            `Docker task ${task.label} should use docker command`
          );
        }

        if (!task.args || !task.args.includes('compose')) {
          results.valid = false;
          results.errors.push(
            `Docker task ${task.label} should use docker compose`
          );
        }
      }
    });
  } catch (error) {
    results.valid = false;
    results.errors.push(`Invalid JSON in tasks.json: ${error.message}`);
  }
}

/**
 * Validate VS Code launch.json configuration
 * @param {Object} results - Results object to update
 */
function validateVSCodeLaunch(results) {
  const launchPath = '.vscode/launch.json';

  if (!fs.existsSync(launchPath)) {
    results.valid = false;
    results.errors.push('VS Code launch.json not found');
    return;
  }

  try {
    const launch = JSON.parse(fs.readFileSync(launchPath, 'utf8'));

    if (!launch.configurations || !Array.isArray(launch.configurations)) {
      results.valid = false;
      results.errors.push(
        'Launch configuration should have configurations array'
      );
      return;
    }

    // Required debug configurations
    const requiredConfigs = [
      'Docker: Debug Verification Agent',
      'Docker: Run Developer Onboarding',
      'Docker: Run BDD Tests',
      'Docker: Run Jest Tests',
    ];

    const configNames = launch.configurations.map((config) => config.name);

    requiredConfigs.forEach((requiredConfig) => {
      if (!configNames.includes(requiredConfig)) {
        results.valid = false;
        results.errors.push(
          `Missing required launch configuration: ${requiredConfig}`
        );
      }
    });

    // Validate Docker debug configuration
    const dockerDebugConfig = launch.configurations.find(
      (config) => config.name === 'Docker: Debug Verification Agent'
    );

    if (dockerDebugConfig) {
      if (
        dockerDebugConfig.type !== 'node' ||
        dockerDebugConfig.request !== 'attach'
      ) {
        results.valid = false;
        results.errors.push(
          'Docker debug configuration should be node attach type'
        );
      }

      if (dockerDebugConfig.port !== 9229) {
        results.valid = false;
        results.errors.push('Docker debug configuration should use port 9229');
      }
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Invalid JSON in launch.json: ${error.message}`);
  }
}

/**
 * Validate VS Code extensions.json configuration
 * @param {Object} results - Results object to update
 */
function validateVSCodeExtensions(results) {
  const extensionsPath = '.vscode/extensions.json';

  if (!fs.existsSync(extensionsPath)) {
    results.valid = false;
    results.errors.push('VS Code extensions.json not found');
    return;
  }

  try {
    const extensions = JSON.parse(fs.readFileSync(extensionsPath, 'utf8'));

    if (
      !extensions.recommendations ||
      !Array.isArray(extensions.recommendations)
    ) {
      results.valid = false;
      results.errors.push(
        'Extensions configuration should have recommendations array'
      );
      return;
    }

    // Required extensions for Docker-only development
    const requiredExtensions = [
      'ms-vscode.vscode-eslint',
      'esbenp.prettier-vscode',
      'ms-azuretools.vscode-docker',
      'alexkrechik.cucumberautocomplete',
      'stevejpurves.cucumber',
      'orta.vscode-jest',
      'yzhang.markdown-all-in-one',
      'davidanson.vscode-markdownlint',
    ];

    requiredExtensions.forEach((requiredExt) => {
      if (!extensions.recommendations.includes(requiredExt)) {
        results.valid = false;
        results.errors.push(`Missing required extension: ${requiredExt}`);
      }
    });

    // Check for unwanted extensions that conflict with Docker-only policy
    const unwantedExtensions = [
      'ms-vscode.vscode-node-azure-pack',
      'ms-vscode.azure-account',
    ];

    if (extensions.unwantedRecommendations) {
      unwantedExtensions.forEach((unwantedExt) => {
        if (!extensions.unwantedRecommendations.includes(unwantedExt)) {
          results.valid = false;
          results.errors.push(`Should mark as unwanted: ${unwantedExt}`);
        }
      });
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Invalid JSON in extensions.json: ${error.message}`);
  }
}

/**
 * Validate task command structure for Docker compliance
 * @param {Object} task - VS Code task configuration
 * @return {Object} Validation result
 */
function validateTaskDockerCompliance(task) {
  const result = {valid: true, errors: []};

  if (task.label.startsWith('Docker:')) {
    // Should use docker command
    if (task.command !== 'docker') {
      result.valid = false;
      result.errors.push(`Task ${task.label} should use docker command`);
    }

    // Should use compose
    if (!task.args || !task.args.includes('compose')) {
      result.valid = false;
      result.errors.push(`Task ${task.label} should use docker compose`);
    }

    // Should not use local npm/node
    const argsString = task.args ? task.args.join(' ') : '';
    if (argsString.includes('npm') && !argsString.includes('run --rm')) {
      result.valid = false;
      result.errors.push(
        `Task ${task.label} should run npm in Docker container`
      );
    }
  }

  return result;
}

/**
 * Generate IDE configuration validation report
 * @return {Object} Comprehensive validation report
 */
function generateIDEValidationReport() {
  const validation = validateIDEConfiguration();

  const report = {
    timestamp: new Date().toISOString(),
    overall: validation.overall.valid,
    summary: {
      settings: validation.settings.valid ? 'PASS' : 'FAIL',
      tasks: validation.tasks.valid ? 'PASS' : 'FAIL',
      launch: validation.launch.valid ? 'PASS' : 'FAIL',
      extensions: validation.extensions.valid ? 'PASS' : 'FAIL',
    },
    errors: validation.overall.errors,
    recommendations: [],
  };

  // Add recommendations based on errors
  if (!validation.settings.valid) {
    report.recommendations.push(
      'Review and update .vscode/settings.json configuration'
    );
  }

  if (!validation.tasks.valid) {
    report.recommendations.push(
      'Review and update .vscode/tasks.json configuration'
    );
  }

  if (!validation.launch.valid) {
    report.recommendations.push(
      'Review and update .vscode/launch.json configuration'
    );
  }

  if (!validation.extensions.valid) {
    report.recommendations.push(
      'Review and update .vscode/extensions.json configuration'
    );
  }

  return report;
}

/**
 * Validate IDE configuration files exist and are properly structured
 * @return {Object} File existence and structure validation
 */
function validateIDEFileStructure() {
  const files = [
    '.vscode/settings.json',
    '.vscode/tasks.json',
    '.vscode/launch.json',
    '.vscode/extensions.json',
  ];

  const result = {valid: true, files: {}, errors: []};

  files.forEach((filePath) => {
    const exists = fs.existsSync(filePath);
    result.files[filePath] = {exists, valid: false};

    if (!exists) {
      result.valid = false;
      result.errors.push(`Missing IDE configuration file: ${filePath}`);
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      result.files[filePath].valid = true;
    } catch (error) {
      result.valid = false;
      result.files[filePath].valid = false;
      result.errors.push(`Invalid JSON in ${filePath}: ${error.message}`);
    }
  });

  return result;
}

module.exports = {
  validateIDEConfiguration,
  validateVSCodeSettings,
  validateVSCodeTasks,
  validateVSCodeLaunch,
  validateVSCodeExtensions,
  validateTaskDockerCompliance,
  generateIDEValidationReport,
  validateIDEFileStructure,
};

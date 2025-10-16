/**
 * Documentation validation utilities for developer workflow tests
 * Validates documentation accuracy, code examples, and compliance with standards
 *
 * @fileoverview Documentation validation support for BDD tests
 * @author AI Voice Verification Agent Team
 */

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

/**
 * Validate documentation accuracy across multiple files
 * @param {Array<string>} documentationFiles - List of documentation file paths
 * @return {Object} Validation results
 */
function validateDocumentationAccuracy(documentationFiles) {
  const results = {
    codeExamples: {valid: true, errors: []},
    dockerCommands: {valid: true, errors: []},
    filePaths: {valid: true, errors: []},
    environmentVariables: {valid: true, errors: []},
    externalLinks: {valid: true, errors: []},
    googleStandards: {valid: true, errors: []},
  };

  documentationFiles.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      results.filePaths.valid = false;
      results.filePaths.errors.push(
        `Documentation file not found: ${filePath}`
      );
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Validate code examples
    validateCodeExamples(content, filePath, results.codeExamples);

    // Validate Docker commands
    validateDockerCommands(content, filePath, results.dockerCommands);

    // Validate file path references
    validateFilePathReferences(content, filePath, results.filePaths);

    // Validate environment variables
    validateEnvironmentVariables(
      content,
      filePath,
      results.environmentVariables
    );

    // Validate external links
    validateExternalLinks(content, filePath, results.externalLinks);

    // Validate Google documentation standards
    validateGoogleStandards(content, filePath, results.googleStandards);
  });

  return results;
}

/**
 * Validate code examples in documentation
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateCodeExamples(content, filePath, results) {
  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1];
    const code = match[2];

    if (language === 'javascript' || language === 'js') {
      try {
        // Basic syntax validation for JavaScript
        new Function(code);
      } catch (error) {
        results.valid = false;
        results.errors.push(
          `Invalid JavaScript in ${filePath}: ${error.message}`
        );
      }
    }

    if (language === 'json') {
      try {
        JSON.parse(code);
      } catch (error) {
        results.valid = false;
        results.errors.push(`Invalid JSON in ${filePath}: ${error.message}`);
      }
    }

    if (language === 'bash' || language === 'sh') {
      // Validate bash commands don't use forbidden patterns
      if (code.includes('npm ') && !code.includes('docker')) {
        results.valid = false;
        results.errors.push(`Forbidden local npm usage in ${filePath}`);
      }

      if (code.includes('node ') && !code.includes('docker')) {
        results.valid = false;
        results.errors.push(`Forbidden local node usage in ${filePath}`);
      }
    }
  }
}

/**
 * Validate Docker commands in documentation
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateDockerCommands(content, filePath, results) {
  // Extract Docker commands
  const dockerCommandRegex = /docker\s+compose\s+[^\n]+/g;
  const commands = content.match(dockerCommandRegex) || [];

  commands.forEach((command) => {
    try {
      // Validate Docker Compose command syntax
      if (command.includes('docker compose')) {
        // Check for common Docker Compose commands
        const validCommands = [
          'up',
          'down',
          'build',
          'run',
          'exec',
          'logs',
          'ps',
          'config',
        ];

        const hasValidCommand = validCommands.some((cmd) =>
          command.includes(cmd)
        );
        if (!hasValidCommand) {
          results.valid = false;
          results.errors.push(
            `Invalid Docker command in ${filePath}: ${command}`
          );
        }
      }
    } catch (error) {
      results.valid = false;
      results.errors.push(
        `Error validating Docker command in ${filePath}: ${error.message}`
      );
    }
  });
}

/**
 * Validate file path references in documentation
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateFilePathReferences(content, filePath, results) {
  // Extract file path references
  const filePathRegex =
    /(?:\.\/|src\/|tests\/|docs\/|scripts\/|\.vscode\/)[^\s\)]+/g;
  const paths = content.match(filePathRegex) || [];

  paths.forEach((referencedPath) => {
    // Clean up the path
    const cleanPath = referencedPath.replace(/[`'"]/g, '');

    // Skip URLs and special patterns
    if (
      cleanPath.includes('http') ||
      cleanPath.includes('example') ||
      cleanPath.includes('<')
    ) {
      return;
    }

    // Check if file or directory exists
    if (!fs.existsSync(cleanPath)) {
      results.valid = false;
      results.errors.push(
        `Referenced path not found in ${filePath}: ${cleanPath}`
      );
    }
  });
}

/**
 * Validate environment variables mentioned in documentation
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateEnvironmentVariables(content, filePath, results) {
  // Extract environment variable references
  const envVarRegex = /([A-Z][A-Z0-9_]+)=/g;
  const envVars = [];
  let match;

  while ((match = envVarRegex.exec(content)) !== null) {
    envVars.push(match[1]);
  }

  // Check if .env.example contains all mentioned variables
  if (fs.existsSync('.env.example')) {
    const envExample = fs.readFileSync('.env.example', 'utf8');

    envVars.forEach((envVar) => {
      if (!envExample.includes(`${envVar}=`)) {
        results.valid = false;
        results.errors.push(
          `Environment variable ${envVar} mentioned in ${filePath} but not in .env.example`
        );
      }
    });
  }
}

/**
 * Validate external links in documentation
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateExternalLinks(content, filePath, results) {
  // Extract external links
  const linkRegex = /https?:\/\/[^\s\)]+/g;
  const links = content.match(linkRegex) || [];

  // For testing purposes, we'll just validate the format
  // In a real implementation, you might want to check if links are accessible
  links.forEach((link) => {
    try {
      new URL(link);
    } catch (error) {
      results.valid = false;
      results.errors.push(`Invalid URL format in ${filePath}: ${link}`);
    }
  });
}

/**
 * Validate Google documentation standards compliance
 * @param {string} content - File content
 * @param {string} filePath - File path for error reporting
 * @param {Object} results - Results object to update
 */
function validateGoogleStandards(content, filePath, results) {
  // Check for Google documentation standards
  const standards = [
    {
      name: 'Clear headings',
      test: (content) => /^#\s+.+$/m.test(content),
      message: 'Document should have clear headings',
    },
    {
      name: 'Table of contents for long documents',
      test: (content) =>
        content.length < 5000 || content.includes('Table of Contents'),
      message: 'Long documents should have a table of contents',
    },
    {
      name: 'Code blocks with language specification',
      test: (content) => {
        const codeBlocks = content.match(/```\w+/g) || [];
        const unspecifiedBlocks = content.match(/```\n/g) || [];
        return unspecifiedBlocks.length === 0 || codeBlocks.length > 0;
      },
      message: 'Code blocks should specify the language',
    },
    {
      name: 'Consistent formatting',
      test: (content) => !content.includes('\t'), // No tabs, use spaces
      message: 'Use spaces instead of tabs for consistent formatting',
    },
  ];

  standards.forEach((standard) => {
    if (!standard.test(content)) {
      results.valid = false;
      results.errors.push(
        `Google standard violation in ${filePath}: ${standard.message}`
      );
    }
  });
}

/**
 * Validate specific documentation sections exist
 * @param {string} content - File content
 * @param {Array<string>} requiredSections - Required section headings
 * @return {Object} Validation result
 */
function validateRequiredSections(content, requiredSections) {
  const result = {valid: true, missing: []};

  requiredSections.forEach((section) => {
    const sectionRegex = new RegExp(`^#+\\s+${section}`, 'm');
    if (!sectionRegex.test(content)) {
      result.valid = false;
      result.missing.push(section);
    }
  });

  return result;
}

/**
 * Extract and validate all Docker commands in documentation
 * @param {string} content - File content
 * @return {Object} Validation result with extracted commands
 */
function extractAndValidateDockerCommands(content) {
  const commands = [];
  const errors = [];

  // Extract all Docker commands from code blocks
  const codeBlockRegex = /```(?:bash|sh)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const codeBlock = match[1];
    const dockerCommands = codeBlock.match(/docker\s+[^\n]+/g) || [];

    dockerCommands.forEach((command) => {
      commands.push(command.trim());

      // Validate command structure
      if (
        !command.includes('compose') &&
        !command.includes('--version') &&
        !command.includes('info')
      ) {
        errors.push(`Potentially invalid Docker command: ${command}`);
      }
    });
  }

  return {
    commands,
    errors,
    valid: errors.length === 0,
  };
}

module.exports = {
  validateDocumentationAccuracy,
  validateCodeExamples,
  validateDockerCommands,
  validateFilePathReferences,
  validateEnvironmentVariables,
  validateExternalLinks,
  validateGoogleStandards,
  validateRequiredSections,
  extractAndValidateDockerCommands,
};

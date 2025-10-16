# Quality Tools Documentation

## Overview

This document provides comprehensive documentation for all quality tools used in the AI Voice
Verification Agent project. All tools are configured to work within Docker containers following our
Docker-only development policy and Google code standards.

## Table of Contents

- [ESLint - Code Linting](#eslint---code-linting)
- [Prettier - Code Formatting](#prettier---code-formatting)
- [Husky - Git Hooks](#husky---git-hooks)
- [lint-staged - Staged File Processing](#lint-staged---staged-file-processing)
- [Snyk - Security Scanning](#snyk---security-scanning)
- [Jest - Unit Testing](#jest---unit-testing)
- [Cucumber - BDD Testing](#cucumber---bdd-testing)
- [Artillery - Performance Testing](#artillery---performance-testing)
- [JSDoc - Documentation Generation](#jsdoc---documentation-generation)
- [markdownlint - Markdown Linting](#markdownlint---markdown-linting)
- [Quality Workflows](#quality-workflows)

## ESLint - Code Linting

### Purpose

Enforces Google JavaScript Style Guide standards and catches potential bugs and code quality issues.

### Configuration

**File**: `.eslintrc.js`

```javascript
module.exports = {
  extends: ['google'],
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', {code: 80, ignoreUrls: true}],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: true,
      },
    ],
  },
};
```

### Usage Commands

```bash
# Run ESLint on all files
docker compose run --rm quality-runner npm run lint

# Run ESLint with auto-fix
docker compose run --rm quality-runner npm run lint:fix

# Lint specific files
docker compose run --rm quality-runner npx eslint src/agents/VerificationAgent.js

# Lint and output to file
docker compose run --rm quality-runner npx eslint src/ --output-file reports/eslint-report.txt
```

### Integration

- **VS Code**: Real-time linting with error highlighting
- **Pre-commit**: Automatic linting before commits
- **CI/CD**: Blocks builds on linting failures

### Common Issues and Solutions

#### Issue: "Parsing error: Unexpected token"

**Solution**: Check for syntax errors in JavaScript files

```bash
docker compose run --rm quality-runner node -c "require('./problematic-file.js')"
```

#### Issue: "Definition for rule 'rule-name' was not found"

**Solution**: Install missing ESLint plugin

```bash
docker compose run --rm quality-runner npm install --save-dev eslint-plugin-name
```

#### Issue: Too many linting errors

**Solution**: Use auto-fix first, then address remaining issues

```bash
docker compose run --rm quality-runner npm run lint:fix
docker compose run --rm quality-runner npm run lint
```

## Prettier - Code Formatting

### Prettier Purpose

Automatically formats code according to Google JavaScript formatting standards.

### Prettier Configuration

**File**: `.prettierrc.js`

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  trailingComma: 'es5',
  bracketSpacing: false,
  arrowParens: 'always',
};
```

### Prettier Usage Commands

```bash
# Format all files
docker compose run --rm quality-runner npm run format

# Check formatting without changing files
docker compose run --rm quality-runner npm run format:check

# Format specific files
docker compose run --rm quality-runner npx prettier --write src/agents/

# Format and show differences
docker compose run --rm quality-runner npx prettier --check --list-different .
```

### Prettier Integration

- **VS Code**: Format on save enabled
- **Pre-commit**: Automatic formatting of staged files
- **ESLint**: Integrated to avoid conflicts

### Prettier Ignore

**File**: `.prettierignore`

```
node_modules/
coverage/
reports/
dist/
build/
*.min.js
package-lock.json
```

## Husky - Git Hooks

### Husky Purpose

Manages Git hooks to run quality checks automatically on Git operations.

### Husky Configuration

**Directory**: `.husky/`

#### Pre-commit Hook

**File**: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged for staged files
npx lint-staged

# Run quick security scan
docker compose run --rm quality-runner npm run security:scan:quick

# Run fast unit tests
docker compose run --rm test-runner npm run test:quick
```

#### Pre-push Hook

**File**: `.husky/pre-push`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run full test suite
docker compose run --rm bdd-runner npm run test:bdd

# Run comprehensive quality checks
docker compose run --rm quality-runner npm run quality:check

# Run security scan
docker compose run --rm quality-runner npm run security:scan
```

### Husky Usage Commands

```bash
# Install Husky hooks
docker compose run --rm verification-agent npx husky install

# Add new hook
docker compose run --rm verification-agent npx husky add .husky/commit-msg 'npx commitlint --edit $1'

# Test hooks manually
.husky/pre-commit
.husky/pre-push
```

## lint-staged - Staged File Processing

### lint-staged Purpose

Runs quality tools only on Git staged files for faster feedback.

### lint-staged Configuration

**File**: `.lintstagedrc.json`

```json
{
  "*.js": ["eslint --fix", "prettier --write", "jsdoc --validate"],
  "*.json": ["prettier --write"],
  "*.md": ["markdownlint --fix", "prettier --write"],
  "*.feature": ["markdownlint --fix"],
  "package*.json": ["npm audit --audit-level moderate"]
}
```

### lint-staged Usage Commands

```bash
# Run lint-staged manually
docker compose run --rm quality-runner npx lint-staged

# Run on specific files
docker compose run --rm quality-runner npx lint-staged --relative src/agents/VerificationAgent.js

# Debug lint-staged
docker compose run --rm quality-runner npx lint-staged --debug
```

## Snyk - Security Scanning

### Snyk Purpose

Scans dependencies for known vulnerabilities and license compliance issues.

### Snyk Configuration

**File**: `.snyk`

```yaml
version: v1.0.0
ignore: {}
patch: {}
```

### Snyk Usage Commands

```bash
# Run vulnerability scan
docker compose run --rm quality-runner npm run security:scan

# Scan and monitor project
docker compose run --rm quality-runner npx snyk monitor

# Test specific severity
docker compose run --rm quality-runner npx snyk test --severity-threshold=high

# Generate security report
docker compose run --rm quality-runner npx snyk test --json > reports/security-report.json
```

### Environment Variables

```bash
# Required for Snyk authentication
SNYK_TOKEN=your_snyk_token_here
```

### Snyk Integration

- **Pre-commit**: Quick vulnerability scan
- **CI/CD**: Comprehensive security scanning
- **Monitoring**: Continuous vulnerability monitoring

## Jest - Unit Testing

### Jest Purpose

Provides unit and integration testing with coverage reporting.

### Jest Configuration

**File**: `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/**/*.spec.js'],
};
```

### Jest Usage Commands

```bash
# Run all tests with coverage
docker compose run --rm test-runner npm run test:coverage

# Run tests in watch mode
docker compose run --rm test-runner npm run test:watch

# Run specific test file
docker compose run --rm test-runner npx jest src/agents/VerificationAgent.test.js

# Run tests with verbose output
docker compose run --rm test-runner npx jest --verbose

# Generate coverage report only
docker compose run --rm test-runner npx jest --coverage --passWithNoTests
```

### Test Structure

```javascript
/**
 * @fileoverview Unit tests for VerificationAgent
 */

const {VerificationAgent} = require('../src/agents/VerificationAgent');

describe('VerificationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new VerificationAgent();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateIdentity', () => {
    it('should validate correct identity information', async () => {
      const result = await agent.validateIdentity('01/01/1990', '1234');
      expect(result).toBe(true);
    });

    it('should reject invalid date format', async () => {
      await expect(agent.validateIdentity('invalid', '1234')).rejects.toThrow(
        'Invalid date format'
      );
    });
  });
});
```

## Cucumber - BDD Testing

### Cucumber Purpose

Behavior-driven development testing using Gherkin scenarios.

### Cucumber Configuration

**File**: `cucumber.js`

```javascript
module.exports = {
  default: {
    require: ['tests/steps/**/*.js'],
    format: ['json:reports/cucumber.json', 'html:reports/cucumber.html', 'progress-bar'],
    paths: ['tests/features/**/*.feature'],
    parallel: 2,
    tags: 'not @skip',
  },
  profiles: {
    smoke: {
      tags: '@smoke',
    },
    regression: {
      tags: 'not @smoke and not @skip',
    },
  },
};
```

### Cucumber Usage Commands

```bash
# Run all BDD tests
docker compose run --rm bdd-runner npm run test:bdd

# Run smoke tests only
docker compose run --rm bdd-runner npm run test:bdd:smoke

# Run specific feature
docker compose run --rm bdd-runner npx cucumber-js tests/features/identity-verification.feature

# Run with specific tags
docker compose run --rm bdd-runner npx cucumber-js --tags "@smoke and @identity"

# Generate reports
docker compose run --rm bdd-runner npm run test:bdd -- --format html:reports/cucumber.html
```

### Feature File Structure

```gherkin
@smoke @identity
Feature: Identity Verification
  As a verification agent
  I want to validate user identity
  So that I can ensure secure access

  Background:
    Given the verification system is initialized
    And I have valid test data

  @positive
  Scenario: Valid identity verification
    Given a user provides valid identity information
    When I validate their date of birth "01/01/1990"
    And I validate their SSN last 4 digits "1234"
    Then the identity verification should pass
    And the user should be allowed to proceed

  @negative
  Scenario: Invalid identity verification
    Given a user provides invalid identity information
    When I validate their date of birth "invalid"
    Then the identity verification should fail
    And the user should receive an error message
```

## Artillery - Performance Testing

### Artillery Purpose

Load and endurance testing for conversation flows and API endpoints.

### Artillery Configuration

**File**: `artillery.yml`

```yaml
config:
  target: 'http://localhost:5253'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 300
      arrivalRate: 50
      name: 'Sustained load'
  processor: './tests/artillery-processor.js'

scenarios:
  - name: 'Identity verification flow'
    weight: 70
    flow:
      - post:
          url: '/api/conversation/start'
          json:
            sessionId: '{{ $randomString() }}'
      - think: 2
      - post:
          url: '/api/conversation/identity'
          json:
            dob: '01/01/1990'
            ssnLast4: '1234'
```

### Artillery Usage Commands

```bash
# Run performance tests
docker compose run --rm performance-runner npm run test:endurance

# Run specific scenario
docker compose run --rm performance-runner npx artillery run tests/performance/identity-flow.yml

# Run with custom target
docker compose run --rm performance-runner npx artillery run --target http://staging.example.com tests/performance/load-test.yml

# Generate detailed report
docker compose run --rm performance-runner npx artillery run --output reports/performance.json tests/performance/load-test.yml
```

## JSDoc - Documentation Generation

### JSDoc Purpose

Generates API documentation from JSDoc comments in source code.

### JSDoc Configuration

**File**: `jsdoc.conf.json`

```json
{
  "source": {
    "include": ["./src/"],
    "includePattern": "\\.(js)$",
    "exclude": ["node_modules/", "tests/"]
  },
  "opts": {
    "destination": "./docs/api/",
    "recurse": true
  },
  "plugins": ["plugins/markdown"],
  "templates": {
    "cleverLinks": false,
    "monospaceLinks": false
  }
}
```

### JSDoc Usage Commands

```bash
# Generate documentation
docker compose run --rm quality-runner npm run docs:generate

# Validate JSDoc comments
docker compose run --rm quality-runner npm run docs:validate

# Generate with custom config
docker compose run --rm quality-runner npx jsdoc -c custom-jsdoc.conf.json

# Watch for changes and regenerate
docker compose run --rm quality-runner npm run docs:watch
```

### JSDoc Comment Standards

```javascript
/**
 * Validates user identity information against external verification service.
 *
 * This function performs secure identity verification by checking the provided
 * date of birth and SSN last 4 digits against trusted verification sources.
 *
 * @param {string} dateOfBirth - Date of birth in MM/DD/YYYY format
 * @param {string} ssnLast4 - Last 4 digits of Social Security Number
 * @param {Object} [options] - Optional verification parameters
 * @param {number} [options.timeout=30000] - Verification timeout in milliseconds
 * @param {boolean} [options.strictMode=true] - Enable strict validation mode
 * @return {Promise<boolean>} Promise resolving to true if identity is verified
 * @throws {ValidationError} When input parameters are invalid
 * @throws {VerificationError} When external verification service fails
 *
 * @example
 * // Verify user identity
 * const isValid = await validateIdentity('01/15/1985', '1234');
 * if (isValid) {
 *   console.log('Identity verified successfully');
 * }
 *
 * @example
 * // Verify with custom timeout
 * const isValid = await validateIdentity('01/15/1985', '1234', {
 *   timeout: 10000,
 *   strictMode: false
 * });
 *
 * @since 1.0.0
 * @see {@link https://internal-docs/identity-verification} Identity Verification Guide
 */
async function validateIdentity(dateOfBirth, ssnLast4, options = {}) {
  // Implementation
}
```

## markdownlint - Markdown Linting

### markdownlint Purpose

Ensures consistent formatting and style in Markdown documentation files.

### markdownlint Configuration

**File**: `.markdownlint.json`

```json
{
  "default": true,
  "MD013": {
    "line_length": 100,
    "code_blocks": false,
    "tables": false
  },
  "MD033": {
    "allowed_elements": ["br", "sub", "sup"]
  },
  "MD041": false
}
```

### markdownlint Usage Commands

```bash
# Lint all Markdown files
docker compose run --rm quality-runner npx markdownlint docs/ README.md

# Fix auto-fixable issues
docker compose run --rm quality-runner npx markdownlint --fix docs/

# Lint specific files
docker compose run --rm quality-runner npx markdownlint docs/DEVELOPER-SETUP.md

# Output to file
docker compose run --rm quality-runner npx markdownlint docs/ --output reports/markdown-lint.txt
```

## Quality Workflows

### Pre-commit Workflow

1. **Staged File Processing**: lint-staged processes only changed files
2. **Code Formatting**: Prettier formats JavaScript, JSON, and Markdown
3. **Code Linting**: ESLint validates JavaScript code quality
4. **Security Scan**: Quick Snyk scan for new vulnerabilities
5. **Documentation**: JSDoc validation for API documentation
6. **Quick Tests**: Fast unit tests for changed components

### CI/CD Quality Pipeline

1. **Dependency Installation**: `npm ci` in Docker container
2. **Code Quality**: Full ESLint and Prettier validation
3. **Security Scanning**: Comprehensive Snyk vulnerability scan
4. **Unit Testing**: Complete Jest test suite with coverage
5. **BDD Testing**: Full Cucumber scenario execution
6. **Performance Testing**: Artillery load tests
7. **Documentation**: JSDoc generation and validation
8. **Quality Gates**: All checks must pass for deployment

### Daily Quality Checks

```bash
# Complete quality validation
docker compose run --rm quality-runner npm run quality:check

# This runs:
# - ESLint validation
# - Prettier formatting check
# - Security vulnerability scan
# - License compliance check
# - Documentation validation
# - Code coverage analysis
```

### Quality Metrics and Reporting

#### Coverage Requirements

- **Minimum Coverage**: 90% for lines, functions, branches, statements
- **Coverage Reports**: HTML, LCOV, JSON formats
- **Coverage Enforcement**: Builds fail if coverage drops below threshold

#### Security Requirements

- **Vulnerability Threshold**: No high or critical vulnerabilities
- **License Compliance**: Only approved licenses (MIT, Apache-2.0, BSD-3-Clause, ISC)
- **Dependency Scanning**: All dependencies scanned on every build

#### Performance Requirements

- **Response Time**: P95 < 2 seconds for API endpoints
- **Load Testing**: Support 100+ concurrent users
- **Memory Usage**: No memory leaks in sustained load tests

### Troubleshooting Quality Tools

#### Common Issues

1. **ESLint Configuration Errors**

   ```bash
   docker compose run --rm quality-runner npx eslint --print-config package.json
   ```

2. **Prettier Formatting Conflicts**

   ```bash
   docker compose run --rm quality-runner npm run format
   docker compose run --rm quality-runner npm run lint:fix
   ```

3. **Jest Test Failures**

   ```bash
   docker compose run --rm test-runner npx jest --verbose --no-cache
   ```

4. **Snyk Authentication Issues**

   ```bash
   docker compose run --rm quality-runner npx snyk auth
   ```

5. **Coverage Threshold Failures**
   ```bash
   docker compose run --rm test-runner npx jest --coverage --verbose
   ```

### Quality Tool Integration Matrix

| Tool         | Pre-commit | CI/CD | VS Code | Reports |
| ------------ | ---------- | ----- | ------- | ------- |
| ESLint       | ✅         | ✅    | ✅      | ✅      |
| Prettier     | ✅         | ✅    | ✅      | ❌      |
| Snyk         | ✅         | ✅    | ❌      | ✅      |
| Jest         | ✅         | ✅    | ✅      | ✅      |
| Cucumber     | ❌         | ✅    | ✅      | ✅      |
| Artillery    | ❌         | ✅    | ❌      | ✅      |
| JSDoc        | ✅         | ✅    | ❌      | ✅      |
| markdownlint | ✅         | ✅    | ✅      | ✅      |

This comprehensive quality tools documentation ensures all team members understand how to use,
configure, and troubleshoot the quality assurance tools in our Docker-only development environment.

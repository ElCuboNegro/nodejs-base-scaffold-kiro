---
inclusion: always
---

# BDD Testing Standards for Pre-Development Setup

## Overview

This document defines the Behavior-Driven Development (BDD) testing standards for the AI Voice
Verification Agent project's pre-development setup phase. All BDD tests must follow these standards
to ensure consistency, maintainability, and comprehensive coverage.

## Gherkin Feature File Standards

### Feature File Structure

```gherkin
@category @subcategory
Feature: Clear, descriptive feature name
  As a [role]
  I want [functionality]
  So that [benefit]

  Background:
    Given [common setup steps]
    And [additional setup]

  @tag @specific-tag
  Scenario: Descriptive scenario name
    Given [precondition]
    When [action]
    Then [expected outcome]
    And [additional verification]

  @tag @outline
  Scenario Outline: Template scenario name
    Given [precondition with "<parameter>"]
    When [action with "<parameter>"]
    Then [expected outcome with "<expected>"]

    Examples:
      | parameter | expected |
      | value1    | result1  |
      | value2    | result2  |
```

### Required Tags by Category

#### Pre-Development Setup Tags

- `@pre-development` - All pre-development setup features
- `@project-setup` - Project initialization and configuration
- `@code-quality` - Code quality tools and standards
- `@security` - Security scanning and compliance
- `@testing` - Testing framework configuration
- `@performance` - Performance and endurance testing
- `@ci-cd` - CI/CD pipeline configuration
- `@documentation` - Documentation automation

#### Task-Specific Tags

- `@task-1` through `@task-16` - Specific implementation tasks
- `@package-json` - Package.json configuration tests
- `@eslint-config` - ESLint configuration tests
- `@prettier-config` - Prettier configuration tests
- `@husky-setup` - Git hooks configuration tests
- `@snyk-scanning` - Snyk security scanning tests
- `@jest-configuration` - Jest testing framework tests
- `@bdd-framework` - Cucumber BDD framework tests

#### Quality Tags

- `@smoke` - Critical functionality tests
- `@integration` - Integration testing scenarios
- `@regression` - Regression testing scenarios
- `@creates-temp-files` - Scenarios that create temporary files

## Step Definition Standards

### File Organization

```
tests/steps/
├── project-initialization-steps.js    # Task 1 steps
├── code-quality-steps.js              # Tasks 2-3 steps
├── pre-commit-hooks-steps.js          # Task 4 steps
├── security-scanning-steps.js         # Task 5 steps
├── testing-framework-steps.js         # Tasks 6-7 steps
├── performance-testing-steps.js       # Task 8 steps
├── ci-cd-pipeline-steps.js            # Task 9 steps
├── documentation-steps.js             # Task 10 steps
├── audit-compliance-steps.js          # Task 11 steps
├── docker-testing-steps.js            # Task 12 steps
├── quality-recovery-steps.js          # Task 13 steps
├── configuration-validation-steps.js  # Task 14 steps
├── performance-monitoring-steps.js    # Task 15 steps
└── developer-workflow-steps.js        # Task 16 steps
```

### Step Definition Code Standards

#### Function Documentation

```javascript
/**
 * Step definition for validating package.json dependencies
 * Verifies all required dependencies are present and properly versioned
 * @param {string} dependencyType - Type of dependencies to check
 */
Then('it should contain all {string} dependencies', function (dependencyType) {
  // Implementation following Google JavaScript Style Guide
});
```

#### Error Handling

```javascript
When('I run security scanning', function () {
  try {
    this.scanResult = execSync('npm run security:scan', {
      encoding: 'utf8',
      cwd: this.projectRoot,
    });
    this.scanExitCode = 0;
  } catch (error) {
    this.scanResult = error.stdout || error.message;
    this.scanExitCode = error.status || 1;
  }
});
```

#### Assertion Standards

```javascript
Then('it should pass all quality gates', function () {
  expect(this.qualityCheckExitCode).toBe(0);
  expect(this.qualityCheckOutput).toContain('All checks passed');
  expect(this.qualityCheckOutput).not.toContain('FAILED');
});
```

## Test Data Management

### Mock Data Generation

```javascript
/**
 * Generate mock vulnerability data for security testing
 * @param {number} count - Number of vulnerabilities to generate
 * @return {Array} Array of mock vulnerability objects
 */
generateMockVulnerabilities(count = 1) {
  return Array.from({length: count}, (_, i) => ({
    id: `MOCK-VULN-${i + 1}`,
    severity: ['low', 'moderate', 'high', 'critical'][i % 4],
    cvss: Math.random() * 10,
    package: `mock-package-${i + 1}`,
    version: '1.0.0'
  }));
}
```

### PII-Free Test Data

- Never use real personal information in test scenarios
- Use clearly fake but realistic data patterns
- Generate random but consistent test data
- Use placeholder patterns like `[name]`, `[email]`, `[phone]`

## Cucumber Configuration Standards

### Profile Configuration

```javascript
// cucumber.js profiles for different test categories
{
  'pre-development': {
    tags: '@pre-development',
    parallel: 2,
    timeout: 30000
  },
  'security': {
    tags: '@security',
    parallel: 1,
    timeout: 45000
  },
  'performance': {
    tags: '@performance',
    parallel: 1,
    timeout: 60000
  }
}
```

### Report Generation

- JSON reports: `reports/cucumber.json`
- HTML reports: `reports/cucumber.html`
- JUnit XML: `reports/cucumber.xml` (for CI/CD)
- Custom reports: Category-specific report files

## Test Execution Standards

### MANDATORY: Docker-Only Execution

**ALL TESTS MUST RUN INSIDE DOCKER CONTAINERS - NO EXCEPTIONS**

All development, testing, and quality checks MUST be executed within Docker containers to ensure:

- Consistent environment across all developers
- Proper dependency management
- Security isolation
- Reproducible results

### Docker-Based NPM Scripts

```json
{
  "docker:test:bdd": "docker compose run --rm bdd-runner npm run test:bdd",
  "docker:test:project": "docker compose run --rm bdd-runner npm run test:bdd:project",
  "docker:test:quality": "docker compose run --rm bdd-runner npm run test:bdd:quality",
  "docker:test:security": "docker compose run --rm bdd-runner npm run test:bdd:security",
  "docker:test:performance": "docker compose run --rm bdd-runner npm run test:bdd:performance",
  "docker:test:ci-cd": "docker compose run --rm bdd-runner npm run test:bdd:ci-cd",
  "docker:test:docs": "docker compose run --rm bdd-runner npm run test:bdd:docs"
}
```

### Docker Service Profiles

```yaml
# BDD testing profile
docker compose --profile bdd run bdd-runner npm run test:bdd

# Quality tools profile
docker compose --profile quality run quality-runner npm run quality:check

# Performance testing profile
docker compose --profile performance run performance-runner npm run test:endurance

# Full testing suite
docker compose --profile testing run test-runner npm run test:coverage
```

### Mandatory Docker Commands

```bash
# CORRECT: Run BDD tests in Docker
docker compose run --rm bdd-runner npm run test:bdd

# CORRECT: Run specific category tests
docker compose run --rm bdd-runner npm run test:bdd:security

# CORRECT: Generate reports in Docker
docker compose run --rm bdd-runner npm run test:bdd -- --format json:reports/cucumber.json

# CORRECT: Run quality checks
docker compose run --rm quality-runner npm run quality:check

# CORRECT: Run performance tests
docker compose run --rm performance-runner npm run test:endurance

# WRONG: Never run tests directly on host
# npm run test:bdd  ❌ FORBIDDEN
# npx cucumber-js   ❌ FORBIDDEN
```

## Coverage and Quality Requirements

### BDD Test Coverage

- Every task in the implementation plan must have corresponding BDD scenarios
- Every requirement must be covered by at least one BDD scenario
- Every npm script must be validated through BDD tests
- Every configuration file must have validation scenarios

### Quality Gates

- All BDD tests must pass before code commits
- BDD tests must run in CI/CD pipeline
- Failed BDD tests must block deployments
- BDD test results must be included in quality reports

## Maintenance Standards

### Feature File Updates

- Update feature files when requirements change
- Maintain traceability between requirements and scenarios
- Version control all BDD test changes
- Review BDD tests during code reviews

### Step Definition Maintenance

- Keep step definitions DRY (Don't Repeat Yourself)
- Refactor common steps into shared utilities
- Update step definitions when APIs change
- Maintain backward compatibility when possible

### Test Data Maintenance

- Regularly update mock data to reflect real-world scenarios
- Ensure test data remains PII-free
- Update test data when business rules change
- Validate test data integrity regularly

## Integration with Quality Tools

### Pre-commit Hook Integration

```javascript
// lint-staged configuration for BDD files
"*.feature": [
  "markdownlint --fix",
  "cucumber-js --dry-run"
],
"tests/steps/*.js": [
  "eslint --fix",
  "prettier --write",
  "jsdoc --validate"
]
```

### CI/CD Pipeline Integration

```yaml
# GitHub Actions workflow step
- name: Run BDD Tests
  run: |
    npm run test:bdd
    npm run test:bdd:security
    npm run test:bdd:performance
```

### Reporting Integration

- BDD results included in quality dashboards
- Failed scenarios trigger notifications
- Test metrics tracked over time
- Coverage reports include BDD test coverage

This BDD testing standard ensures comprehensive, maintainable, and high-quality behavior-driven
tests for the pre-development setup phase of the AI Voice Verification Agent project.

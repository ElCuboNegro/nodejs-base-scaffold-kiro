@pre-development @git-hooks
Feature: Pre-commit Hooks with Quality Gates
  As a developer
  I want automated pre-commit hooks that enforce quality standards
  So that only high-quality, secure code is committed to the repository

  Background:
    Given I have a Git repository initialized
    And Husky is installed and configured
    And lint-staged is configured for staged file processing

  @task-4 @husky-setup
  Scenario: Husky is properly configured for Git hooks
    Given I have Husky installed
    When I check the Git hooks directory
    Then I should have a pre-commit hook configured
    And the pre-commit hook should be executable
    And it should reference the Husky configuration

  @task-4 @lint-staged-config
  Scenario: lint-staged processes different file types appropriately
    Given I have lint-staged configured
    When I examine the lint-staged configuration
    Then JavaScript files should be processed with ESLint and Prettier
    And JSON files should be formatted with Prettier
    And Markdown files should be linted with markdownlint
    And package.json files should be audited for security

  @task-4 @pre-commit-quality-gates
  Scenario: Pre-commit hook enforces all quality gates
    Given I have staged files with various issues
    When I attempt to commit the changes
    Then the pre-commit hook should run ESLint validation
    And it should run Prettier formatting checks
    And it should run JSDoc validation
    And it should run security audits
    And it should run license compliance checks

  @task-4 @pre-commit-failure-handling
  Scenario: Pre-commit hook prevents commits when quality checks fail
    Given I have staged JavaScript files with linting errors
    When I attempt to commit the changes
    Then the commit should be blocked
    And I should receive clear error messages about the violations
    And I should get guidance on how to fix the issues
    And the files should remain staged for correction

  @task-4 @pre-commit-success-flow
  Scenario: Pre-commit hook allows commits when all checks pass
    Given I have staged files that pass all quality checks
    When I attempt to commit the changes
    Then all quality gates should pass
    And the commit should be allowed to proceed
    And the files should be automatically formatted if needed
    And I should receive confirmation of successful validation

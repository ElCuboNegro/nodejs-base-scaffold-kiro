@pre-development @code-quality
Feature: Code Quality Tools Configuration
  As a developer
  I want comprehensive code quality tools configured with Google standards
  So that I can maintain consistent, secure, and high-quality code

  Background:
    Given I have a properly initialized Node.js project
    And all quality tool dependencies are installed

  @task-2 @eslint-config
  Scenario: ESLint is configured with Google JavaScript Style Guide
    Given I have an .eslintrc.js configuration file
    When I examine the ESLint configuration
    Then it should extend the Google ESLint configuration
    And it should include Node.js environment settings
    And it should include custom rules for financial services security
    And it should include rules for conversation flow validation
    And it should include rules for LLM integration patterns

  @task-2 @eslint-validation
  Scenario: ESLint validates code against Google standards
    Given I have JavaScript code that violates Google style guide
    When I run ESLint on the code
    Then it should report style guide violations
    And it should provide specific error messages
    And it should reference Google style guide rules
    And it should prevent commits when violations exist

  @task-3 @prettier-config
  Scenario: Prettier is configured with Google formatting standards
    Given I have a .prettierrc configuration file
    When I examine the Prettier configuration
    Then it should follow Google JavaScript formatting preferences
    And it should use 2-space indentation
    And it should use single quotes for strings
    And it should enforce semicolons
    And it should set line length to 80 characters

  @task-3 @prettier-formatting
  Scenario: Prettier automatically formats code to Google standards
    Given I have unformatted JavaScript code
    When I run Prettier on the code
    Then it should format the code according to Google standards
    And it should fix indentation issues
    And it should fix quote consistency
    And it should fix line length violations

  @task-3 @prettier-eslint-integration
  Scenario: Prettier and ESLint configurations are compatible
    Given I have both Prettier and ESLint configured
    When I run both tools on the same code
    Then there should be no conflicts between formatting rules
    And Prettier should handle formatting concerns
    And ESLint should handle code quality concerns
    And both should follow Google standards

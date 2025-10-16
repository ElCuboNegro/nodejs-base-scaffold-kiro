@pre-development @project-setup
Feature: Project Structure and Package Configuration
  As a developer
  I want a properly initialized Node.js project with all required dependencies
  So that I can develop the AI voice verification agent with proper tooling

  Background:
    Given I am in the project root directory
    And the project is a Node.js application

  @task-1 @package-json
  Scenario: Package.json contains all required dependencies
    Given I have a package.json file
    When I examine the dependencies section
    Then it should contain all runtime dependencies for the voice verification agent
    And it should contain all development dependencies for quality tools
    And it should contain all testing dependencies for BDD and coverage
    And it should contain all security scanning dependencies

  @task-1 @node-version
  Scenario: Node.js version constraints are properly configured
    Given I have a package.json file
    When I check the engines configuration
    Then it should require Node.js version 24.10.0 or higher
    And it should require npm version 10.0.0 or higher
    And I should have a .nvmrc file specifying version 24.10.0

  @task-1 @npm-scripts
  Scenario Outline: Development workflow scripts are available
    Given I have a package.json file
    When I check the scripts section
    Then it should contain a "<script_name>" script
    And the "<script_name>" script should execute "<expected_command>"

    Examples:
      | script_name      | expected_command                    |
      | start            | node src/index.js                  |
      | test             | jest                                |
      | test:coverage    | jest --coverage                     |
      | test:bdd         | cucumber-js --config cucumber.js   |
      | lint             | eslint src/ tests/ --ext .js       |
      | security:scan    | npm audit && snyk test             |
      | quality:check    | npm run lint && npm run format:check && npm run security:scan && npm run test:coverage |

  @task-1 @directory-structure
  Scenario: Basic project directory structure exists
    Given I am in the project root directory
    When I check the project structure
    Then I should have a "src" directory for source code
    And I should have a "tests" directory for test files
    And I should have a "docs" directory for documentation
    And I should have a "scripts" directory for utility scripts
    And I should have a "reports" directory for test reports

  @task-1 @environment-config
  Scenario: Environment configuration template is available
    Given I am in the project root directory
    When I check for environment configuration
    Then I should have a .env.example file
    And it should contain all required environment variables
    And it should include LLM integration configuration
    And it should include security configuration
    And it should include database configuration

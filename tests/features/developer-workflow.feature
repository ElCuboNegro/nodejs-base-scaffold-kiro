@pre-development @task-16 @developer-workflow
Feature: Developer Workflow Integration and Documentation
  As a developer
  I want comprehensive setup documentation and IDE integration
  So that I can efficiently develop and maintain the verification agent

  Background:
    Given I have a clean development environment
    And Docker is running and accessible
    And the project repository is properly initialized

  @smoke @documentation
  Scenario: Developer setup documentation is comprehensive and accurate
    Given I am a new developer joining the project
    When I read the developer setup documentation
    Then I should find clear prerequisites and system requirements
    And I should find step-by-step setup instructions
    And I should find comprehensive environment configuration guidance
    And I should find Docker-only development workflow instructions
    And I should find quality tools usage documentation
    And I should find troubleshooting information

  @smoke @onboarding-script
  Scenario: Developer onboarding script validates environment successfully
    Given I have the required development tools installed
    And I have configured the environment variables
    When I run the developer onboarding script
    Then it should validate Docker installation and version
    And it should validate Docker Compose availability
    And it should validate Git installation
    And it should check if Docker daemon is running
    And it should validate project structure integrity
    And it should validate environment configuration
    And it should test Docker services functionality
    And it should test quality tools in Docker containers
    And it should generate a comprehensive validation report
    And it should create IDE configuration files

  @onboarding-script @error-handling
  Scenario: Developer onboarding script handles missing requirements gracefully
    Given I have an incomplete development environment
    When I run the developer onboarding script with missing Docker
    Then it should detect Docker is not installed
    And it should provide clear installation instructions
    And it should fail gracefully with helpful error messages
    And it should not proceed with Docker-dependent validations

  @onboarding-script @environment-validation
  Scenario: Developer onboarding script validates environment configuration
    Given I have Docker and Git installed
    But I have not configured environment variables
    When I run the developer onboarding script
    Then it should detect missing .env file
    And it should provide instructions to copy .env.example
    And it should validate required environment variables
    And it should warn about missing optional variables with defaults
    And it should fail validation if critical variables are missing

  @ide-integration @vscode
  Scenario: VS Code IDE integration is properly configured
    Given I have VS Code installed
    When I open the project in VS Code
    Then I should see recommended extensions notification
    And the workspace should have proper settings configuration
    And I should have Docker-integrated terminal profiles
    And I should have pre-configured tasks for all Docker operations
    And I should have launch configurations for debugging
    And ESLint should work with Google JavaScript Style Guide
    And Prettier should format code according to Google standards
    And file associations should provide proper syntax highlighting

  @ide-integration @tasks
  Scenario: VS Code tasks execute Docker commands correctly
    Given I have VS Code configured with the project
    And Docker services are available
    When I run the "Docker: Install Dependencies" task
    Then it should execute npm ci in the verification-agent container
    When I run the "Docker: Run All BDD Tests" task
    Then it should execute BDD tests in the bdd-runner container
    When I run the "Docker: Run Quality Checks" task
    Then it should execute quality checks in the quality-runner container
    And all tasks should complete successfully without local npm usage

  @ide-integration @debugging
  Scenario: VS Code debugging integration works with Docker containers
    Given I have VS Code configured for debugging
    And the verification agent is running with debug port exposed
    When I start the "Docker: Debug Verification Agent" configuration
    Then the debugger should attach to the running container
    And I should be able to set breakpoints in the source code
    And the debugger should stop at breakpoints during execution
    And I should be able to inspect variables and call stack

  @troubleshooting @documentation
  Scenario: Troubleshooting guide covers common development issues
    Given I encounter a development issue
    When I consult the troubleshooting guide
    Then I should find solutions for Docker-related problems
    And I should find solutions for environment configuration issues
    And I should find solutions for quality tools problems
    And I should find solutions for testing issues
    And I should find solutions for IDE configuration problems
    And I should find solutions for Git and pre-commit issues
    And each solution should provide clear step-by-step instructions
    And solutions should follow the Docker-only development policy

  @troubleshooting @docker-issues
  Scenario Outline: Troubleshooting guide provides solutions for Docker issues
    Given I encounter a Docker-related issue: "<issue>"
    When I follow the troubleshooting guide solution
    Then the issue should be resolved
    And the solution should maintain Docker-only development policy

    Examples:
      | issue                           |
      | Docker Desktop not running      |
      | Port already in use            |
      | Docker Compose build failures  |
      | Container memory issues        |
      | Volume mount issues            |

  @quality-tools @integration
  Scenario: Quality tools are properly integrated in the developer workflow
    Given I have the development environment set up
    When I make code changes that violate quality standards
    And I attempt to commit the changes
    Then pre-commit hooks should run automatically
    And ESLint should detect and report code quality issues
    And Prettier should format code according to Google standards
    And security scanning should detect vulnerabilities
    And the commit should be blocked if quality checks fail
    And I should receive clear feedback on required fixes

  @documentation @accuracy
  Scenario: Documentation accuracy is validated through automated tests
    Given I have documentation files for developer workflow
    When I run documentation validation tests
    Then all code examples in documentation should be syntactically correct
    And all Docker commands should be valid and executable
    And all file paths referenced should exist in the project
    And all environment variables mentioned should be documented
    And all external links should be accessible
    And documentation should follow Google documentation standards

  @workflow @end-to-end
  Scenario: Complete developer workflow from setup to contribution
    Given I am a new developer with no prior project setup
    When I follow the complete developer workflow
    Then I should successfully clone the repository
    And I should successfully run the developer onboarding script
    And I should successfully configure my IDE
    And I should successfully start the development environment
    And I should successfully run all quality checks
    And I should successfully run all tests
    And I should successfully make a code change
    And I should successfully commit with pre-commit hooks passing
    And I should be ready to contribute to the project

  @performance @workflow
  Scenario: Developer workflow operations complete within acceptable time limits
    Given I have a properly configured development environment
    When I execute common developer workflow operations
    Then the developer onboarding script should complete within 5 minutes
    And Docker service startup should complete within 2 minutes
    And quality checks should complete within 3 minutes
    And BDD test execution should complete within 10 minutes
    And IDE configuration should be instantaneous
    And pre-commit hooks should complete within 1 minute

  @creates-temp-files @cleanup
  Scenario: Developer workflow creates and cleans up temporary files properly
    Given I run developer workflow operations
    When operations create temporary files or configurations
    Then temporary files should be created in appropriate locations
    And temporary files should not contain sensitive information
    And temporary files should be cleaned up after operations complete
    And no temporary files should be committed to version control
    And IDE configuration files should be properly managed

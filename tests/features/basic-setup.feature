@pre-development @project-setup @smoke
Feature: Basic Project Setup Validation
  As a developer
  I want to verify the basic project setup is correct
  So that I can ensure the Docker-only BDD framework is working

  Background:
    Given I am in the project root directory
    And the project is a Node.js application

  @package-json @smoke
  Scenario: Package.json contains required dependencies
    Given I have a package.json file
    When I examine the dependencies section
    Then it should contain all runtime dependencies for the voice verification agent
    And it should contain all development dependencies for quality tools
    And it should contain all testing dependencies for BDD and coverage
    And it should contain all security scanning dependencies

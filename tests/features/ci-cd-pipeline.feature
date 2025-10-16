@pre-development @ci-cd
Feature: CI/CD Pipeline with Quality Gates
  As a DevOps engineer
  I want automated CI/CD pipelines with comprehensive quality gates
  So that I can ensure secure and reliable application deployments

  Background:
    Given I have a GitHub repository with Actions configured
    And CI/CD pipeline workflows are defined

  @task-9 @quality-gates-workflow
  Scenario: Quality gates workflow runs on code push
    Given I have a quality gates workflow configured
    When I push code to the main branch
    Then it should trigger the automated pipeline
    And it should run all quality checks
    And it should run security scanning
    And it should run comprehensive tests
    And it should generate quality reports

  @task-9 @security-scanning-pipeline
  Scenario: Security scanning pipeline blocks vulnerable deployments
    Given I have security scanning in the CI/CD pipeline
    When the pipeline detects security vulnerabilities
    Then it should block the deployment
    And it should generate detailed security reports
    And it should notify relevant stakeholders
    And it should provide remediation guidance

  @task-9 @automated-deployment
  Scenario: Automated deployment to staging environment
    Given all quality gates pass in the pipeline
    When the pipeline reaches the deployment stage
    Then it should automatically deploy to staging
    And it should run database migrations if needed
    And it should update environment configurations
    And it should verify deployment success

  @task-9 @smoke-tests-health-checks
  Scenario: Smoke tests and health checks validate deployment
    Given the application is deployed to staging
    When the deployment completes
    Then it should run smoke tests
    And it should perform health checks
    And it should validate API endpoints
    And it should verify database connectivity
    And it should confirm all services are operational

  @task-9 @pipeline-failure-handling
  Scenario: Pipeline handles failures gracefully
    Given a step in the CI/CD pipeline fails
    When the failure occurs
    Then it should stop the pipeline execution
    And it should provide detailed failure information
    And it should notify the development team
    And it should preserve artifacts for debugging

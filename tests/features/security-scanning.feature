@pre-development @security
Feature: Security Scanning Infrastructure
  As a security engineer
  I want comprehensive security scanning for dependencies and code
  So that I can identify and prevent security vulnerabilities early

  Background:
    Given I have a Node.js project with dependencies
    And security scanning tools are configured

  @task-5 @snyk-scanning
  Scenario: Snyk scans for dependency vulnerabilities
    Given I have Snyk configured for vulnerability scanning
    When I run Snyk security scan
    Then it should scan all project dependencies
    And it should report any known vulnerabilities
    And it should provide severity ratings for vulnerabilities
    And it should suggest remediation steps

  @task-5 @npm-audit
  Scenario: npm audit identifies security issues
    Given I have npm audit configured with severity thresholds
    When I run npm audit
    Then it should check all dependencies for security advisories
    And it should report vulnerabilities at or above the threshold
    And it should provide detailed vulnerability information
    And it should suggest update paths for fixes

  @task-5 @license-compliance
  Scenario: License checker validates dependency licenses
    Given I have license-checker configured with allowed licenses
    When I run license compliance check
    Then it should scan all dependency licenses
    And it should allow only MIT, Apache-2.0, BSD-3-Clause, and ISC licenses
    And it should report any non-compliant licenses
    And it should block builds with license violations

  @task-5 @security-integration
  Scenario: Security scanning integrates with development workflow
    Given I have security scanning configured in npm scripts
    When I run the quality check script
    Then it should execute npm audit
    And it should execute Snyk test
    And it should execute license compliance check
    And it should fail if any security issues are found

  @task-5 @security-reporting
  Scenario: Security scanning generates comprehensive reports
    Given I run security scanning tools
    When security issues are detected
    Then I should get detailed vulnerability reports
    And reports should include CVSS scores
    And reports should include affected package versions
    And reports should include remediation guidance
    And reports should be saved for audit purposes

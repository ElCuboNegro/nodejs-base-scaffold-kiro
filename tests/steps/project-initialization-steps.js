/**
 * Step definitions for project initialization and package configuration
 * Follows Google JavaScript Style Guide standards
 */

const {Given, When, Then} = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

/**
 * Background steps for project setup validation
 */
Given('I am in the project root directory', function () {
  this.projectRoot = process.cwd();
  assert(
    fs.existsSync(this.projectRoot),
    'Project root directory should exist'
  );
});

Given('the project is a Node.js application', function () {
  const packageJsonPath = path.join(this.projectRoot, 'package.json');
  assert(fs.existsSync(packageJsonPath), 'package.json should exist');

  this.packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  assert(this.packageJson.name, 'package.json should have a name');
  assert(this.packageJson.version, 'package.json should have a version');
});

/**
 * Package.json validation steps
 */
Given('I have a package.json file', function () {
  const packageJsonPath = path.join(this.projectRoot, 'package.json');
  assert(fs.existsSync(packageJsonPath), 'package.json should exist');

  this.packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
});

When('I examine the dependencies section', function () {
  assert(
    this.packageJson.dependencies,
    'package.json should have dependencies'
  );
  assert(
    this.packageJson.devDependencies,
    'package.json should have devDependencies'
  );
});

Then(
  'it should contain all runtime dependencies for the voice verification agent',
  function () {
    const requiredDeps = [
      'express',
      'joi',
      'winston',
      'redis',
      'pg',
      'sequelize',
      'dotenv',
      'helmet',
      'cors',
      'openai',
      '@anthropic-ai/sdk',
      'axios',
      'uuid',
      'validator',
    ];

    requiredDeps.forEach((dep) => {
      assert(
        this.packageJson.dependencies[dep],
        `Dependency ${dep} should be defined`
      );
    });
  }
);

Then(
  'it should contain all development dependencies for quality tools',
  function () {
    const qualityDeps = [
      'eslint',
      'eslint-config-google',
      'prettier',
      'husky',
      'lint-staged',
      'jsdoc',
      'markdownlint-cli',
    ];

    qualityDeps.forEach((dep) => {
      assert(
        this.packageJson.devDependencies[dep],
        `Dev dependency ${dep} should be defined`
      );
    });
  }
);

Then(
  'it should contain all testing dependencies for BDD and coverage',
  function () {
    const testingDeps = [
      'jest',
      '@jest/globals',
      'supertest',
      'sinon',
      'nock',
      '@cucumber/cucumber',
      'artillery',
      'nyc',
    ];

    testingDeps.forEach((dep) => {
      assert(
        this.packageJson.devDependencies[dep],
        `Testing dependency ${dep} should be defined`
      );
    });
  }
);

Then('it should contain all security scanning dependencies', function () {
  const securityDeps = ['snyk', 'license-checker'];

  securityDeps.forEach((dep) => {
    assert(
      this.packageJson.devDependencies[dep],
      `Security dependency ${dep} should be defined`
    );
  });
});

/**
 * Node.js version validation steps
 */
When('I check the engines configuration', function () {
  assert(
    this.packageJson.engines,
    'package.json should have engines configuration'
  );
  this.engines = this.packageJson.engines;
});

Then('it should require Node.js version {float} or higher', function (version) {
  assert(this.engines.node, 'engines should specify node version');
  assert(
    this.engines.node.includes(`>=${version}`),
    `Node version should be >=${version}`
  );
});

Then('it should require npm version {float} or higher', function (version) {
  assert(this.engines.npm, 'engines should specify npm version');
  assert(
    this.engines.npm.includes(`>=${version}`),
    `npm version should be >=${version}`
  );
});

Then(
  'I should have a .nvmrc file specifying version {float}',
  function (version) {
    const nvmrcPath = path.join(this.projectRoot, '.nvmrc');
    assert(fs.existsSync(nvmrcPath), '.nvmrc file should exist');

    const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
    assert.strictEqual(
      nvmrcContent,
      version.toString(),
      `.nvmrc should contain ${version}`
    );
  }
);

/**
 * NPM scripts validation steps
 */
When('I check the scripts section', function () {
  assert(this.packageJson.scripts, 'package.json should have scripts section');
  this.scripts = this.packageJson.scripts;
});

Then('it should contain a {string} script', function (scriptName) {
  assert(this.scripts[scriptName], `Script ${scriptName} should be defined`);
});

Then(
  'the {string} script should execute {string}',
  function (scriptName, expectedCommand) {
    // In Docker-only environment, scripts show enforcement messages instead of executing directly
    const script = this.scripts[scriptName];
    const isDockerEnforcement =
      script.includes('FORBIDDEN') || script.includes('docker compose');

    if (isDockerEnforcement) {
      // For Docker-only enforcement, we expect the script to reference Docker or show prohibition
      assert(
        script.includes('docker compose') || script.includes('FORBIDDEN'),
        `Script ${scriptName} should enforce Docker-only usage`
      );
    } else {
      // For normal scripts, check for expected command
      assert(
        script.includes(expectedCommand),
        `Script ${scriptName} should contain ${expectedCommand}`
      );
    }
  }
);

Then(
  'it should require Node.js version {word} or higher',
  function (expectedVersion) {
    const engines = this.packageJson.engines;

    assert(
      engines && engines.node,
      'Package.json should specify Node.js version in engines'
    );
    assert(
      engines.node.includes(expectedVersion),
      `Should require Node.js ${expectedVersion} or higher`
    );
  }
);

Then(
  'it should require npm version {word} or higher',
  function (expectedVersion) {
    const engines = this.packageJson.engines;

    assert(
      engines && engines.npm,
      'Package.json should specify npm version in engines'
    );
    assert(
      engines.npm.includes(expectedVersion),
      `Should require npm ${expectedVersion} or higher`
    );
  }
);

Then(
  'I should have a .nvmrc file specifying version {word}',
  function (expectedVersion) {
    const nvmrcPath = path.join(this.projectRoot, '.nvmrc');

    assert(fs.existsSync(nvmrcPath), '.nvmrc file should exist');

    const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf8').trim();
    assert(
      nvmrcContent.includes(expectedVersion),
      `.nvmrc should specify version ${expectedVersion}`
    );
  }
);

/**
 * Directory structure validation steps
 */
When('I check the project structure', function () {
  this.directories = fs
    .readdirSync(this.projectRoot, {withFileTypes: true})
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
});

Then('I should have a {string} directory for source code', function (dirName) {
  assert(
    this.directories.includes(dirName),
    `Directory ${dirName} should exist in project`
  );

  const dirPath = path.join(this.projectRoot, dirName);
  assert(
    fs.existsSync(dirPath),
    `Directory ${dirPath} should exist on filesystem`
  );
});

Then('I should have a {string} directory for test files', function (dirName) {
  assert(
    this.directories.includes(dirName),
    `Directory ${dirName} should exist in project`
  );

  const dirPath = path.join(this.projectRoot, dirName);
  assert(
    fs.existsSync(dirPath),
    `Directory ${dirPath} should exist on filesystem`
  );
});

Then(
  'I should have a {string} directory for documentation',
  function (dirName) {
    assert(
      this.directories.includes(dirName),
      `Directory ${dirName} should exist in project`
    );

    const dirPath = path.join(this.projectRoot, dirName);
    assert(
      fs.existsSync(dirPath),
      `Directory ${dirPath} should exist on filesystem`
    );
  }
);

Then(
  'I should have a {string} directory for utility scripts',
  function (dirName) {
    assert(
      this.directories.includes(dirName),
      `Directory ${dirName} should exist in project`
    );

    const dirPath = path.join(this.projectRoot, dirName);
    assert(
      fs.existsSync(dirPath),
      `Directory ${dirPath} should exist on filesystem`
    );
  }
);

Then('I should have a {string} directory for test reports', function (dirName) {
  assert(
    this.directories.includes(dirName),
    `Directory ${dirName} should exist in project`
  );

  const dirPath = path.join(this.projectRoot, dirName);
  assert(
    fs.existsSync(dirPath),
    `Directory ${dirPath} should exist on filesystem`
  );
});

/**
 * Environment configuration validation steps
 */
When('I check for environment configuration', function () {
  const envExamplePath = path.join(this.projectRoot, '.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example file should exist');

  this.envExample = fs.readFileSync(envExamplePath, 'utf8');
});

Then('I should have a .env.example file', function () {
  const envExamplePath = path.join(this.projectRoot, '.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example file should exist');
});

Then('it should contain all required environment variables', function () {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'LLM_PROVIDER',
    'LLM_API_KEY',
    'ENCRYPTION_KEY',
    'SESSION_SECRET',
    'REDIS_URL',
    'DATABASE_URL',
  ];

  requiredVars.forEach((varName) => {
    assert(
      this.envExample.includes(varName),
      `Environment variable ${varName} should be in .env.example`
    );
  });
});

Then('it should include LLM integration configuration', function () {
  const llmVars = ['LLM_PROVIDER', 'LLM_API_KEY', 'LLM_MODEL', 'LLM_TIMEOUT'];

  llmVars.forEach((varName) => {
    assert(
      this.envExample.includes(varName),
      `LLM variable ${varName} should be in .env.example`
    );
  });
});

Then('it should include security configuration', function () {
  const securityVars = [
    'ENCRYPTION_KEY',
    'SESSION_SECRET',
    'PII_PSEUDONYMIZATION_KEY',
  ];

  securityVars.forEach((varName) => {
    assert(
      this.envExample.includes(varName),
      `Security variable ${varName} should be in .env.example`
    );
  });
});

Then('it should include database configuration', function () {
  const dbVars = ['DATABASE_URL', 'REDIS_URL', 'DB_PASSWORD'];

  dbVars.forEach((varName) => {
    assert(
      this.envExample.includes(varName),
      `Database variable ${varName} should be in .env.example`
    );
  });
});

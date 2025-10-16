---
inclusion: always
---

# CLI Command Enforcement - Docker-Only Policy

## ABSOLUTE PROHIBITION: NO LOCAL CLI COMMANDS ALLOWED

This project enforces **ZERO TOLERANCE** for local CLI commands. Every command must be executed
inside Docker containers.

## Forbidden Local Commands

### ❌ COMPLETELY PROHIBITED - NEVER RUN THESE

```bash
# Package Management - FORBIDDEN
npm install
npm ci
npm update
npm audit
npm run <any-script>
npx <any-command>
yarn install
yarn add
yarn remove

# Node.js Execution - FORBIDDEN
node <any-file>
node src/index.js
node scripts/<any-script>

# Testing Commands - FORBIDDEN
jest
cucumber-js
artillery
mocha
nyc

# Quality Tools - FORBIDDEN
eslint <any-file>
prettier <any-file>
jsdoc <any-file>
markdownlint <any-file>

# Security Tools - FORBIDDEN
snyk test
snyk monitor
license-checker

# Build Tools - FORBIDDEN
webpack
rollup
parcel
vite

# Database Tools - FORBIDDEN
sequelize-cli
prisma
knex

# Any Direct Binary Execution - FORBIDDEN
./node_modules/.bin/<any-binary>
```

## Mandatory Docker Equivalents

### ✅ REQUIRED: Use These Docker Commands Instead

#### Package Management

```bash
# Instead of: npm install
docker compose run --rm verification-agent npm install

# Instead of: npm ci
docker compose run --rm verification-agent npm ci

# Instead of: npm audit
docker compose run --rm quality-runner npm audit

# Instead of: npm run <script>
docker compose run --rm <appropriate-service> npm run <script>

# Instead of: npx <command>
docker compose run --rm <appropriate-service> npx <command>
```

#### Testing Commands

```bash
# Instead of: npm run test
docker compose run --rm test-runner npm run test

# Instead of: npm run test:bdd
docker compose run --rm bdd-runner npm run test:bdd

# Instead of: npx cucumber-js
docker compose run --rm bdd-runner npx cucumber-js

# Instead of: npm run test:coverage
docker compose run --rm test-runner npm run test:coverage

# Instead of: npx jest
docker compose run --rm test-runner npx jest
```

#### Quality Tools

```bash
# Instead of: npm run lint
docker compose run --rm quality-runner npm run lint

# Instead of: npx eslint
docker compose run --rm quality-runner npx eslint

# Instead of: npm run format
docker compose run --rm quality-runner npm run format

# Instead of: npx prettier
docker compose run --rm quality-runner npx prettier

# Instead of: npm run docs:generate
docker compose run --rm quality-runner npm run docs:generate
```

#### Security Scanning

```bash
# Instead of: npm run security:scan
docker compose run --rm quality-runner npm run security:scan

# Instead of: npx snyk test
docker compose run --rm quality-runner npx snyk test

# Instead of: npm audit
docker compose run --rm quality-runner npm audit
```

#### Application Execution

```bash
# Instead of: node src/index.js
docker compose up verification-agent

# Instead of: npm start
docker compose up verification-agent

# Instead of: npm run dev
docker compose run --rm verification-agent npm run dev
```

## Service-Specific Command Mapping

### verification-agent Service

```bash
# Application execution
docker compose run --rm verification-agent npm start
docker compose run --rm verification-agent npm run dev
docker compose run --rm verification-agent node src/index.js

# Database operations
docker compose run --rm verification-agent npm run db:migrate
docker compose run --rm verification-agent npm run db:seed
```

### test-runner Service

```bash
# Unit and integration tests
docker compose run --rm test-runner npm run test
docker compose run --rm test-runner npm run test:unit
docker compose run --rm test-runner npm run test:integration
docker compose run --rm test-runner npm run test:coverage
```

### bdd-runner Service

```bash
# BDD and Cucumber tests
docker compose run --rm bdd-runner npm run test:bdd
docker compose run --rm bdd-runner npm run test:bdd:project
docker compose run --rm bdd-runner npm run test:bdd:security
docker compose run --rm bdd-runner npx cucumber-js
```

### quality-runner Service

```bash
# Code quality and security
docker compose run --rm quality-runner npm run lint
docker compose run --rm quality-runner npm run format
docker compose run --rm quality-runner npm run security:scan
docker compose run --rm quality-runner npm run docs:generate
```

### performance-runner Service

```bash
# Performance testing
docker compose run --rm performance-runner npm run test:endurance
docker compose run --rm performance-runner npx artillery run
```

## Pre-commit Hook Enforcement

### Husky Configuration

```javascript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Verify Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop."
  exit 1
fi

# Run quality checks in Docker
docker compose run --rm quality-runner npm run quality:check

# Run BDD tests in Docker
docker compose run --rm bdd-runner npm run test:bdd

echo "✅ All quality gates passed in Docker containers"
```

### Git Hooks Validation

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Ensure no local node_modules exists
if [ -d "node_modules" ]; then
  echo "❌ Local node_modules detected. Remove it and use Docker only."
  echo "   Run: rm -rf node_modules"
  exit 1
fi

# Run comprehensive tests in Docker
docker compose run --rm test-runner npm run test:coverage
docker compose run --rm quality-runner npm run security:scan

echo "✅ All tests passed in Docker containers"
```

## IDE Integration Enforcement

### VS Code Settings

```json
{
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.profiles.linux": {
    "Docker Bash": {
      "path": "docker",
      "args": ["compose", "exec", "verification-agent", "bash"]
    }
  },
  "npm.packageManager": "docker",
  "eslint.runtime": "docker",
  "prettier.resolveGlobalModules": false,
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

### Package.json Scripts Override

```json
{
  "scripts": {
    "preinstall": "echo '❌ Use docker compose run --rm verification-agent npm install' && exit 1",
    "install": "echo '❌ Use docker compose run --rm verification-agent npm install' && exit 1",
    "test": "echo '❌ Use docker compose run --rm test-runner npm run test' && exit 1",
    "lint": "echo '❌ Use docker compose run --rm quality-runner npm run lint' && exit 1",
    "format": "echo '❌ Use docker compose run --rm quality-runner npm run format' && exit 1"
  }
}
```

## Environment Validation

### Docker Requirement Check

```bash
#!/bin/bash
# scripts/validate-environment.sh

echo "🔍 Validating Docker-only environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Install Docker Desktop."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Start Docker Desktop."
    exit 1
fi

# Check for forbidden local installations
if [ -d "node_modules" ]; then
    echo "❌ Local node_modules found. Remove it:"
    echo "   rm -rf node_modules"
    exit 1
fi

if [ -f "package-lock.json" ] && [ ! -f ".docker-only" ]; then
    echo "❌ Local package-lock.json without Docker marker."
    echo "   Remove local installations and use Docker only."
    exit 1
fi

# Check for local npm cache
if [ -d "$HOME/.npm" ]; then
    echo "⚠️  Local npm cache exists. Consider clearing it:"
    echo "   npm cache clean --force"
fi

echo "✅ Environment validation passed"
```

## Makefile for Enforced Commands

```makefile
# Makefile - Enforced Docker commands only

.PHONY: help install test lint format security build up down clean

help: ## Show this help message
	@echo "Docker-Only Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies in Docker
	docker compose run --rm verification-agent npm ci

test: ## Run all tests in Docker
	docker compose run --rm test-runner npm run test:coverage

test-bdd: ## Run BDD tests in Docker
	docker compose run --rm bdd-runner npm run test:bdd

lint: ## Run linting in Docker
	docker compose run --rm quality-runner npm run lint

format: ## Format code in Docker
	docker compose run --rm quality-runner npm run format

security: ## Run security scan in Docker
	docker compose run --rm quality-runner npm run security:scan

quality: ## Run all quality checks in Docker
	docker compose run --rm quality-runner npm run quality:check

build: ## Build Docker images
	docker compose build

up: ## Start all services
	docker compose up --build

down: ## Stop all services
	docker compose down

clean: ## Clean up Docker resources
	docker compose down -v
	docker system prune -f

# Prevent direct npm usage
npm:
	@echo "❌ Direct npm usage is forbidden. Use 'make install' instead."
	@exit 1

node:
	@echo "❌ Direct node usage is forbidden. Use Docker services instead."
	@exit 1
```

## Shell Aliases for Enforcement

### Bash/Zsh Aliases

```bash
# ~/.bashrc or ~/.zshrc

# Disable local npm/node commands
alias npm='echo "❌ Use Docker: docker compose run --rm <service> npm <command>" && false'
alias node='echo "❌ Use Docker: docker compose run --rm <service> node <command>" && false'
alias npx='echo "❌ Use Docker: docker compose run --rm <service> npx <command>" && false'

# Docker shortcuts
alias dc='docker compose'
alias dcr='docker compose run --rm'
alias dcu='docker compose up'
alias dcd='docker compose down'

# Project-specific shortcuts
alias test-bdd='docker compose run --rm bdd-runner npm run test:bdd'
alias test-all='docker compose run --rm test-runner npm run test:coverage'
alias quality='docker compose run --rm quality-runner npm run quality:check'
alias security='docker compose run --rm quality-runner npm run security:scan'
alias lint='docker compose run --rm quality-runner npm run lint'
alias format='docker compose run --rm quality-runner npm run format'
```

## CI/CD Pipeline Enforcement

### GitHub Actions Validation

```yaml
name: Docker-Only Validation
on: [push, pull_request]

jobs:
  validate-docker-only:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate No Local Dependencies
        run: |
          if [ -d "node_modules" ]; then
            echo "❌ Local node_modules found in repository"
            exit 1
          fi

      - name: Validate Docker Configuration
        run: |
          docker compose config

      - name: Run Tests in Docker Only
        run: |
          docker compose run --rm bdd-runner npm run test:bdd
          docker compose run --rm quality-runner npm run quality:check
          docker compose run --rm test-runner npm run test:coverage
```

## Documentation Enforcement

### README.md Template

````markdown
# AI Voice Verification Agent

## 🐳 Docker-Only Development

**IMPORTANT: This project uses Docker-only development. No local npm/node commands are allowed.**

### Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd ai-voice-verification-agent
cp .env.example .env

# Start development (Docker only)
docker compose up --build

# Run tests (Docker only)
docker compose run --rm bdd-runner npm run test:bdd

# Quality checks (Docker only)
docker compose run --rm quality-runner npm run quality:check
```
````

### ❌ Forbidden Commands

- `npm install` - Use `docker compose run --rm verification-agent npm install`
- `npm test` - Use `docker compose run --rm test-runner npm test`
- `node src/index.js` - Use `docker compose up verification-agent`

### ✅ Required Commands

All development must use Docker containers via `docker compose run --rm <service> <command>`

```

This comprehensive CLI enforcement ensures that no local commands can be executed, maintaining the Docker-only development environment with zero exceptions.
```
